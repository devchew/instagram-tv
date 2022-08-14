import React, { FunctionComponent } from 'react';
import { closeWindow } from '../api/process';

const AppControls: FunctionComponent = () => {

    return (
        <div className="app-controls">
            <button className="app-controls__close" onClick={closeWindow}>X</button>
        </div>
    );
};

export default AppControls;
