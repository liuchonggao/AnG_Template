# -*- encoding: utf-8 -*-
import logging
import sys
import argparse
import datetime
import os
import logging
import mimetypes
import time
from os import listdir
from os.path import isfile, join
from multiprocessing import Pool
from itertools import repeat


def upload_files(params):
    bucket = params[0]
    files = params[1]

    local_total = len(files)
    uploaded_total = 0
    failed_total = 0
    uploaded_size = 0

    for f in files:
        filepath = f[0]
        relpath = f[1]
        filename, fileext = os.path.splitext(filepath)
        local_size = os.path.getsize(filepath)
        my_key = bucket.new_key(relpath)
        print('uploading : {0} as {1}, size : {2}'.format(filepath, relpath, local_size))
        result = None
        if fileext == '.mp4':
            result = my_key.set_contents_from_filename(filepath, headers={'content-type': 'video/mp4'})
        else:
            result = my_key.set_contents_from_filename(filepath)
        if(result is not None and result == local_size):
            uploaded_total = uploaded_total + 1
            uploaded_size = uploaded_size + result
            print('uploaded : {0}, size : {1}'.format(filepath, result))
        else:
            failed_total = failed_total + 1
            print('failed : {0}, local size : {1}, remote size : {2}'.format(filepath, local_size, result))
    return ( local_total, uploaded_total, failed_total, uploaded_size)

def get_local_files_list(rootpath, url_prefix):
    print('get_local_files_list started')
    start = time.clock()

    local_files = []
    rootdir = rootpath
    for root, subFolders, files in os.walk(rootdir):
        for file in files:
            f = os.path.join(root,file)
            # relDir = os.path.relpath(root, rootdir)
            # relFile = os.path.join(relDir, file)
            relFile = url_prefix + file
            local_files.append((f, relFile))
    end = time.clock()
    print('get_local_files_list finished. Execution time : {0}'.format(end - start))
    return local_files

if __name__ == '__main__':
    access_key = 'QEYWy4NypRsEHJ17WGMcAQ=='
    secret_key = '+K9WHcrttmNJ6PuMZMF6ig=='

    parser = argparse.ArgumentParser()
    parser.add_argument('filepath', nargs='?', default=os.getcwd())
    parser.add_argument('--processes', nargs='?', default=4, type=int)
    parser.add_argument('--bucket', nargs='?', default='tracking')
    parser.add_argument('--prefix', nargs='?', default='')
    parser.add_argument('logname', nargs='?', default='sync')
    args = parser.parse_args()

    bucket_name = args.bucket
    url_prefix = args.prefix
    process_num = args.processes
    workspace = args.filepath

    print(args)

    FORMAT = "%(asctime)s|~|%(threadName)-12.12s|~|%(levelname)-5.5s|~|%(message)s"
    logging.basicConfig(format=FORMAT)

    log = logging.getLogger('')
    logFormatter = logging.Formatter("%(asctime)s|~|%(threadName)-12.12s|~|%(levelname)-5.5s|~|%(message)s")

    fileHandler = logging.FileHandler("{0}/{1}.log".format('.', args.logname))
    # fileHandler.setFormatter(logFormatter)
    log.addHandler(fileHandler)

    consoleHandler = logging.StreamHandler()
    # consoleHandler.setFormatter(logFormatter)
    log.addHandler(consoleHandler)

    conn = None
    bucket = None
    local_total = 0
    cloud_total = 0
    uploaded_total = 0
    failed_total = 0
    uploaded_size = 0
    start_time = time.clock()

    log.info('initialize_app')
    import vulpo
    from vulpo.scs.connection import SCSConnection 
    conn = SCSConnection(access_key, secret_key)
    bucket = conn.get_bucket(bucket_name)
    print('Using bucket : {0}'.format(bucket))

    start1 = time.clock()
    print('Retrieving remote files')
    remote_files = []
    cloud_total = len(remote_files)
    end1 = time.clock()
    print('Remote files total : {0}, execution time : {1}'.format(cloud_total, end1 - start1))

    local_files = get_local_files_list(workspace, url_prefix)
    
    start2 = time.clock()
    print('Filtering out new files')
    new_files = [ f for f in local_files if f[1] not in remote_files]
    new_total = len(new_files)
    end2 = time.clock()
    print('Found {0} new files. Execution time : {1}'.format(new_total, end2 - start2))

    result = None
    if new_total > 0:
        process_size = int(len(local_files)/process_num) + 1
        chunks = [new_files[x:x+process_size] for x in range(0, len(new_files), process_size)]
        params = []
        for c in enumerate(chunks):
            params.append((bucket, c[1]))
        try:
            pool = Pool(processes=process_num)
            result = pool.map(upload_files, params)
            pool.close()
            pool.join()
        except:
            pool.terminate()
            pool.join()
    else:
        result = [(0, 0, 0, 0)]

    end_time = time.clock()
    delta = end_time - start_time
            
    print('********************* AGWEBSYNC ************************')
    print('agwebsync completed\n')
    print('duration : {0}'.format(delta))
    print(result)
    print('\n')
    print('Files local total : {0}'.format(len(local_files)))
    print('Files bucket total : {0}'.format(cloud_total))
    print('Files to upload : {0}'.format(len(new_files)))
    print('Files uploaded : {0}'.format(sum(r[1] for r in result)))
    print('Files failed : {0}'.format(sum(r[2] for r in result)))
    print('Files uploaded total size : {0}'.format(sum(r[3] for r in result)))
    print('********************* AGWEBSYNC ************************')

    sys.exit(0)