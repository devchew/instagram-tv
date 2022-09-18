# Instagram tv

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
