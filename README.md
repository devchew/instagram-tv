# Instagram tv

## install on device via ssh

> i've only tested it for raspberry pi

after login into raspberry pi

```
git clone https://github.com/devchew/instagram-tv
cd instagram-tv
npm ci
cp .env.example .env
```

now put credentials into .env file and save `ctrl x`

```
npm run make
sudo dpkg -i out/make/deb/armv7l/instagram-tv
```

tap `tab` and let autocomplete get the filename, and pres enter

## get credentials for .env file

https://developers.facebook.com/docs/instagram-basic-display-api/getting-started

`Valid OAuth Redirect URIs` set `https://localhost/auth`

## develop

Instagram feed viewer.

This app is optimized for raspberrypi + tv combo

```
cp .env.example .env
<edit .env file and fill the api codes>
npm i
npm run make
```

## autorun

on raspberry pi edit file

```bash
sudo nano /etc/xdg/lxsession/LXDE-pi/autostart
```

and add `@instagram-tv` on end

## logs

logs are stored in

on Linux: `~/.config/instagram-tv/logs/main.log`
on macOS: `~/Library/Logs/instagram-tv/main.log`
on Windows: `%USERPROFILE%\AppData\Roaming\instagram-tv\logs\main.log`
