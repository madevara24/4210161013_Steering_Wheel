var HID = require('node-hid')
var devices = HID.devices()

console.log(devices)

var deviceInfo = devices.find(function (d) {
    var isSteeringHweel = d.release === 336;
    return isSteeringHweel;
});

if (deviceInfo) {
    var device = new HID.HID(deviceInfo.path);
    device.on("data", function (data) {
        parseData(data)
        // console.log('Accelerate ', data[14], data[15])
        // console.log(data[12], data[13])
    });
}
// 14 - 15 pedal kanan/kiri
// Pedal kanan 15 : 255-128
// Pedal kanan 14 : 128-0
// Kanan 128 - 255 & 0 - 127
// Kiri 128 - 0 & 255 - 128

function parseData(data) {
    console.log('Pedal : ', getAcceleration(data))
    console.log('Setir : ', getSteer(data))
}

function getAcceleration(data) {
    if (data[14] === 128 && data[15] === 0) {
        return 'idle';
    } else if (data[14] < 128 && data[15] > 128) {
        return 'Gas';
    } else if (data[14] > 128 && data[15] < 128) {
        return 'Brake';
    }
}

function getSteer(data) {
    if (data[12] === 128 && data[13] === 0) {
        return 'idle';
    } else if (data[12] > 128 && data[13] < 128) {
        return 'Kanan';
    } else if (data[12] < 128 && data[13] > 128) {
        return 'Kiri';
    }
}