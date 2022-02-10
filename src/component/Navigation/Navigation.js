import React from "react";

// Pure function

const Navigation = ({onRouteChange, isSignedIn}) => {
    if(isSignedIn){

        return (
            <nav style={{display: 'flex', justifyContent: 'end'}}>
                <p className='f3 dim link black underline pointer pa3' onClick={() => onRouteChange('signout')}>Sign Out</p>
            </nav>
        );
    }
    else {
        return (
            <nav style={{display: 'flex', justifyContent: 'end'}}>
                {/*{console.log(isSignedIn)}*/}
                <p className='f3 dim link black underline pointer pa3' onClick={() => onRouteChange('signin')}>Sign In</p>
                <p className='f3 dim link black underline pointer pa3' onClick={() => onRouteChange('register')}>Register</p>
            </nav>
        );

    }

}
export default Navigation;