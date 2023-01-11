# block-match

**block-match** is a simple single-player browser game that challenges the players rotational skills
using a gyroscope-enabled mobile device.

### [Visit the Demo](https://block-match.vercel.app/)

## How to play

Open the game on your computer and then, on your smartphone, navigate to the URL
shown at the bottom of the screen. Once there, enter the code that is displayed on
your computer screen.

Once the game has started, you can rotate the bottom part by simply rotating your
device (if not, see the Troubleshooting section below). While the first level is
relatively simple, the levels get more challenging later on.

## Development

Clone the respository and make sure you have Node.js (>= 16.x.x) and yarn installed. Then run

    yarn        # Install dependencies
    yarn dev    # Run webserver

You can then open `http://localhost:3000/`

For local testing, also run in a seperate terminal:

    yarn local-ssl-proxy --source=3001 --target=3000

Make sure to use port `3001` on your mobile device when testing locally. This ensures that you access the site via an encrypted connection. Otherwise, the device orientation functionality might be blocked by your browser.

## Troubleshooting

If you have trouble getting connected, make sure you are not connected to a VPN and
that you have a stable connection. Try using an Android phone if you are having
issues on iOS.

If you are having trouble getting to the smartphone view, use change the URL from `.../game` to `.../controller`

## But why?

This small game was created as part of an exercise for the Mobile Computing and Internet of Things
lecture at KIT
