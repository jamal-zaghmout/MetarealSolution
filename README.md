# MetaReal Image Capture & Upload | on Jetson Nano

This README will be a guide for users to set up the Jetson Nano to work with MetaReal's SDK and API.

This project runs as a script and captures an image using the Ricoh Theta Z1 camera and then uploads the captured image
to a specific MetaReal project using their SDK (using Node.js) and API.

---

## Prerequisites

- ### npm

[**npm**](https://www.npmjs.com) is a package manager for the JavaScript programming language. npm is the default
package manager for the JavaScript runtime environment Node.js. We will use it to install certain packages needed to run
the script.

- ### libphoto2 & node-gphoto2

**[libgphoto2](http://www.gphoto.org/proj/libgphoto2/)** is a library that can be used by applications to access various
digital cameras and is used as a means
for the device to communicate with the camera.
**[node-gphoto2](https://npm.io/package/gphoto2)** is a Node.js wrapper to libgphoto2 and this gives direct access to
nearly all the libgphoto2 functions.

## How to Set Up a Jetson Nano

#### Install npm

To install `npm`, we must download its compressed archive file, extract it, then copy the extracted files to a certain
directory.

To do so, run the following commands:

```shell
cd ~/Downloads
wget https://nodejs.org/dist/latest-v16.x/node-v16.16.0-linux-arm64.tar.xz
tar -xJf node-v16.16.0-linux-arm64.tar.xz 
cd node-v16.16.0-linux-arm64/
sudo cp -R * /usr/local
```

To test if npm runs, try the following command:

```shell
npm -v
```

#### Install libgphoto2

To install `libgphoto2`, we must download its compressed archive file, extract it, and then start the installation
process. [LINK](https://github.com/gphoto/libgphoto2/blob/master/INSTALL)

To do so, run the following commands:

```shell
wget -c https://sourceforge.net/projects/gphoto/files/latest/download -O libgphoto2.tar.bz2
tar xf libgphoto2.tar.bz2
cd libgphoto2-*
./configure --prefix=/usr/local
make
sudo make install
```

After installing libgphoto2, we should stop 1 *or* 2 processes from running, since they interfere with our ability to
capture an image using the library. These processes give out the error: **Could not claim the USB device**.

To permanently stop these processes, run the following commands:

```shell
sudo chmod -x /usr/lib/gvfs/gvfs-gphoto2-volume-monitor
sudo chmod -x /usr/lib/gvfs/gvfsd-gphoto2
```

*The second command may or may not be needed; it differs from system to system*

#### Clone the MetaReal Image Capture & Upload

To clone the GitHub repository that is on GlobalDWS's GitHub projects page, we must first install the git command on the
Jetson Nano. After doing so, we must clone the repo to the home directory ~.

To do so, run the following commands:

```shell
sudo apt install git
cd ~
git clone https://github.com/jamal-zaghmout/MetarealSolution.git
```

#### Install npm packages

Now, we will install some packages required to run the script before running `npm init` in the project directory. The
packages are: `request`, `process`, and `gphoto2`.

To install them using `npm`, run the following commands in the `MetarealImageCaptureAndUpload` directory:

```shell
cd ~/MetarealImageCaptureAndUpload/
npm install request
npm install process
npm install gphoto2
```

---



To run the solution, run the following commands:

```shell
npm init
node index.js
```

