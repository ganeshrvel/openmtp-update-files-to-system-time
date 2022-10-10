### fix creation and modification date/time for files transferred to macbook using OpenMTP
It will read the exif information in an image or video and update the creation and modification date/time for files transferred to macbook using OpenMTP

### Requirement: nodejs 16+

## WARNING: BACKUP your files before running this script
 - To run the script goto images_videos.mjs and change the `camDir` to any path which contains images and videos.
 - This will only work for images and videos

on macos run:
```shell
  cd /to/some/path
  git clone https://github.com/ganeshrvel/openmtp-update-files-to-system-time
  
  npm install -g zx
  brew update
  brew install exiftool
 
 ```

export these variables this before running the script
```shell
  export LC_CTYPE=en_US.UTF-8 && export LC_ALL=en_US.UTF-8
```

```shell
  zx ./images_videos.mjs
```
