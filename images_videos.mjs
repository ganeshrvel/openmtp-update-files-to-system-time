#!/usr/bin/env zx

import 'zx/globals';
import fsExtra from 'fs-extra';
import glob from 'glob';
import path from 'path';
import { exif } from './exiftools.mjs';
import dayjs from 'dayjs-with-plugins';
import {isJunk} from 'junk';

const homedir = os.homedir();
dayjs().tz('Asia/Kolkata');

import './base.mjs';

const camDir = path.join(homedir, './Desktop/backups/DCIM'); // ----> change the directory path here

glob( `${camDir}/**/*`, async function (err, files) {
  for await (const file of files) {
    const fullPath = file;
    
    await new Promise((resolve) => {
      exif(fullPath, async function (err, metadata) {
        if (isJunk(file)) {
          return resolve(null);
        }
        
        if (err) {
          console.error(err)
          throw err
        }
        else {
          if(metadata.createDate) {
            const timestamp = dayjs.utc(metadata.createDate.split('.')[0],
              'YYYY:MM:DD HH:mm:ss') // parse the timestring as utc
            const dt = dayjs(timestamp).tz(dayjs.tz.guess())
            const d = dt.toDate()
  
            let dF
            if (metadata.fileTypeExtension === 'mp4') {
              dF = dt.format('MM/DD/YYYY HH:mm:ss')
            }
            else {
              dF = dt.utc().format('MM/DD/YYYY HH:mm:ss')
            }
  
            await $`SetFile -d ${dF} -m ${dF} ${fullPath}`
            console.log(`Done! =>  ${file}`)
          }
  
          return resolve(file)
        }
      });
    })
  }
});

