<h1 align="center">PDB2AR Templates</h1>

<p align="center"><img width="200" alt="img logo" src="https://user-images.githubusercontent.com/21111451/107048927-c835f980-67c9-11eb-80ce-acef34797ad5.png"></p>

[PDB2AR](https://molecularweb.epfl.ch/pages/pdb2ar.html) is a free web-based tool to create immersive experiences to visualize and manipulate molecules. From PDBs, PDB ids, AlphaFold models or 3D objects created in VMD you can easily create AR and VR models of your molecules that run right on the web.

Once you set up your project, PDB2AR will create 3 immersive apps for you:

- AR with a cube marker
- AR to visualize the molecule in your space without markers
- VR app to manipulate your molecule with your hands or controllers using a VR headset

Then, you will receive an email containing the corresponding URLs for each one of these apps. In this repository you will find templates that illustrate how we build each of them.

## Features

:open_hands: **Hand tracking**: Manipulate 3D objects in VR using your hands thanks to WebXR API and Three.js.

:video_game: **Controllers**: Manipulate 3D objects in VR using controllers using WebXR's input profiles and Three.js.

:file_folder: **3D models**: Load previously compressed 3D models for further AR/VR usage using DRACO Loader with Three.js, AR.js and Model Viewer.

:iphone: **Interactive controls**: Add interactive controls to your AR.js scene using web components and custom events. Here you'll find how to zoom in/out the 3D element within the marker and how to mirror and change the camera (front/back) on the fly.

<p align="center"><img width="316" alt="hand tracking" src="https://user-images.githubusercontent.com/21111451/155735522-c8cc536f-e40f-45f8-a8da-32775dfd947b.gif"></p>

<p align="center">
<img width="150" style="margin-right: 16px" alt="img sample" src="https://user-images.githubusercontent.com/21111451/155738401-8d61b04a-d6be-4b52-b09f-ae99943f3c1c.png"></img> 
<img width="150" alt="img sample" src="https://user-images.githubusercontent.com/21111451/155740010-8c3830bc-4e31-44a8-ba0f-74883c967af1.png"></img>

</p>

## Local development

Follow this instructions to run this project on your local machine.

### Prerequisites
To run this project all you need is a basic static server. We use `live-server` package from npm. All you need to have installed is node.js. 

```sh
$ node --version
v17.0.1
$ npm install --global live-server
```

#### Installation / Setup
```sh
$ git clone https://github.com/fcor/pdb2ar-templates.git # Clone the repository.

$ cd pdb2ar-templates # Navigate into the folder

```

#### Running / Development
```sh
$ live-server # Start the local development server
```

Navigate to http://127.0.0.1:8080/vr/ for VR/3D app.

Navigate to http://127.0.0.1:8080/model-viewer/ for model viewer app.

Navigate to http://127.0.0.1:8080/cube-ar/ for AR.js app.


Please keep in mind that this setup will allow you to run the project locally in your computer. If you want to try it in your mobile phone or VR headset you will need to run a server under HTTPS. 


## Credits
This project was possible thanks to the amazing community behind [Three.js](https://threejs.org/), [AR.js](https://ar-js-org.github.io/AR.js-Docs/), [model-viewer](https://modelviewer.dev/) and WebXR community.


This project is manintained by [Fabio Cortés](https://www.fjcr.pro/) and [Luciano Abriata](http://labriataphd.altervista.org/) from the [Laboratory of Biomolecular Modeling](https://www.epfl.ch/labs/lbm/) at [École Polytechnique Fédérale de Lausanne (EPFL)](https://www.epfl.ch/) in Switzerland.

This work was funded by Agora grant CRARP2_202370 from the [Swiss National Science Foundation](https://www.snf.ch/fr) and grant number 21033 from the [Hasler Foundation](https://haslerstiftung.ch/en/welcome-to-the-hasler-foundation/) to LAA.

See the [LICENSE](LICENSE) for details.
