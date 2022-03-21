import React, { useState } from "react";
import pic1 from "../images/tutorial-pics/pic-1.png";
import pic2 from "../images/tutorial-pics/pic-2.png";
import pic3 from "../images/tutorial-pics/pic-3.png";
import pic4 from "../images/tutorial-pics/pic-4.png";
import pic5 from "../images/tutorial-pics/pic-5.png";
import pic6 from "../images/tutorial-pics/pic-6.png";
import pic7 from "../images/tutorial-pics/pic-7.png";
import pic8 from "../images/tutorial-pics/pic-8.png";

export default function Tutorial() {
    const [tutorialPicsSrcs, setTutorialPicsSrcs] = useState([
        pic1,
        pic2,
        pic3,
        pic4,
        pic5,
        pic6,
        pic7,
        pic8,
    ]);
    const [currentPic, setCurrentPic] = useState(pic1)

    function closeModal(){
        const modal = document.getElementById('tutorial-modal')
        modal.close()
    }

    function getPrevPic(){
        const currPic = tutorialPicsSrcs.indexOf(currentPic)
        if(currPic > 0){
            setCurrentPic(tutorialPicsSrcs[currPic - 1])
        }
    }
    function getNextPic(){
        const currPic = tutorialPicsSrcs.indexOf(currentPic)
        if(currPic < 7){
            setCurrentPic(tutorialPicsSrcs[currPic + 1])
        }
    }

    return (
        <dialog id="tutorial-modal">
            <div onClick={closeModal} className="btn close-btn">Close</div>
            <div className="modal-content">
                <div onClick={getPrevPic} className="btn tutorial-btn">{"<-"}</div>
                <img className="tutorial-pic" src={currentPic} />
                <div onClick={getNextPic} className="btn tutorial-btn">{"->"}</div>
            </div>
        </dialog>
    );
}
