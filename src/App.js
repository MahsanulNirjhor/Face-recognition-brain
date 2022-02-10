import React, {Component} from "react";
import './App.css';
import Navigation from "./component/Navigation/Navigation";
import Logo from "./component/Logo/Logo";
import ImageLinkForm from './component/ImageLinkForm/ImageLinkForm';
import Rank from './component/Rank/Rank';
import FaceRecognition from "./component/FaceRecognition/FaceRecognition";
import Signin from "./component/Signin/Signin";
import Register from "./component/Register/Register";
import 'tachyons';
import Particles from "react-tsparticles";
import Clarifai from 'clarifai';


const app = new Clarifai.App({
    apiKey: '38a3d7af8af74347921b1d05c301f3fa'
});
const particlesInit = (main) => {
    console.log(main);
    // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
};

const particlesLoaded = (container) => {
    console.log(container);
};

class App extends Component {
    constructor() {
        super();
        this.state = {
            input: '',
            imageUrl: '',
            box: {},
            route: 'signin',
            isSignedIn : false,
        }

    }

    calculateFaceLocation = (data) => {
        const clarifaiFace = data;
        const image = document.getElementById('inputImage');
        const width = Number(image.width);
        const height = Number(image.height);
        //console.log(width, height);
        return {
            left_col: clarifaiFace.left_col * width,
            top_row: clarifaiFace.top_row * height,
            bottom_row: height - clarifaiFace.bottom_row * height,
            right_col: width - clarifaiFace.right_col * width,
        }

    }

    displayFaceBox = (box) => {

        this.setState({box: box});
        console.log(this.state.box)
    }

    onInputChange = (event) => {
        //console.log(event.target.value);
        this.setState({input: event.target.value});
    }
    onButtonSubmit = () => {
        //console.log('Click');
        this.setState({imageUrl: this.state.input});
        app.models
            .predict(
                Clarifai.FACE_DETECT_MODEL,
                this.state.input)
            .then(response => this.displayFaceBox(
                    this.calculateFaceLocation(response.outputs[0].data.regions[0].region_info.bounding_box)
                )
            )
            .catch(err => console.log(err));

    }
    onRouteChange = (route) => {
        if(route === 'signout'){
            this.setState({isSignedIn : false})

        }
        else if(route === 'home') {
            this.setState({isSignedIn : true})
        }
        this.setState({route: route});
    }

    render() {
        const {isSignedIn, imageUrl, route, box} = this.state;
        return (<div className="App">
            <Particles className={'particles'}
                       id="articles"
                       init={particlesInit}
                       loaded={particlesLoaded}
                       options={{
                           // background: {
                           //     color: {
                           //         value: "#0d47a1",
                           //     },
                           // },
                           fpsLimit: 30, interactivity: {
                               events: {
                                   onClick: {
                                       enable: true, mode: "push",
                                   }, onHover: {
                                       enable: true, mode: "repulse",
                                   }, resize: true,
                               }, modes: {
                                   bubble: {
                                       distance: 400, duration: 2, opacity: 0.8, size: 40,
                                   }, push: {
                                       quantity: 4,
                                   }, repulse: {
                                       distance: 200, duration: 0.4,
                                   },
                               },
                           }, particles: {
                               color: {
                                   value: "#ffffff",
                               }, links: {
                                   color: "#ffffff", distance: 150, enable: true, opacity: 0.5, width: 1,
                               }, collisions: {
                                   enable: true,
                               }, move: {
                                   direction: "none",
                                   enable: true,
                                   outMode: "bounce",
                                   random: false,
                                   speed: 6,
                                   straight: false,
                               }, number: {
                                   density: {
                                       enable: true, area: 800,
                                   }, value: 80,
                               }, opacity: {
                                   value: 0.5,
                               }, shape: {
                                   type: "circle",
                               }, size: {
                                   random: true, value: 5,
                               },
                           }, detectRetina: true,
                       }}
            />

            <Navigation isSignedIn = {isSignedIn} onRouteChange={this.onRouteChange}/>

            {route === 'home'
                ? <div>
                    <Logo/>
                    <Rank/>
                    <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
                    <FaceRecognition box={box} imageUrl={imageUrl}/>
                </div>
                : (
                    route === 'signin' || route === 'signout'
                        ? <Signin onRouteChange={this.onRouteChange}/>
                        : <Register onRouteChange={this.onRouteChange}/>
                )

            }
        </div>);
    }


}

export default App;
