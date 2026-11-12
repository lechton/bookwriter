const options1 = { serverUrl: 'https://localhost:1234', roomId: 'music' };
const options2 = { serverUrl: 'https://localhost:1234', roomId: 'music' };
console.log(Object.is(options1, options2));

const roomId1 = 'music';
const roomId2 = 'music';
console.log(Object.is(roomId1, roomId2));
