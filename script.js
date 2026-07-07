/* =========================
   TIMEVAULT JAVASCRIPT
========================= */


let capsules = JSON.parse(localStorage.getItem("capsules")) || [];





/* =========================
   CREATE CAPSULE
========================= */


function createCapsule(){


    const title =
    document.getElementById("title").value;


    const message =
    document.getElementById("message").value;


    const unlockDate =
    document.getElementById("unlockDate").value;


    const privacy =
    document.getElementById("privacy").value;


    const imageInput =
    document.getElementById("imageUpload");



    if(
        title === "" ||
        message === "" ||
        unlockDate === ""
    ){

        alert("Please fill all required fields");

        return;

    }





    let image = "";



    if(imageInput.files.length > 0){


        const reader = new FileReader();



        reader.onload = function(e){


            saveCapsule(
                title,
                message,
                unlockDate,
                privacy,
                e.target.result
            );


        }



        reader.readAsDataURL(
            imageInput.files[0]
        );


    }

    else{


        saveCapsule(
            title,
            message,
            unlockDate,
            privacy,
            image
        );


    }


}







function saveCapsule(
    title,
    message,
    unlockDate,
    privacy,
    image
){



    const capsule = {


        id: Date.now(),


        title,


        message,


        unlockDate,


        privacy,


        image,


        createdAt:
        new Date().toISOString()



    };



    capsules.push(capsule);



    localStorage.setItem(
        "capsules",
        JSON.stringify(capsules)
    );



    clearForm();


    displayCapsules();



}








/* =========================
   DISPLAY CAPSULES
========================= */


function displayCapsules(){



    const container =
    document.getElementById(
        "capsuleContainer"
    );



    container.innerHTML = "";



    capsules.forEach(
        capsule => {



        const unlocked =
        new Date() >=
        new Date(capsule.unlockDate);





        let remaining =
        getCountdown(
            capsule.unlockDate
        );





        container.innerHTML += `


        <div class="capsule-card">


        ${
            capsule.image ?

            `<img src="${capsule.image}">`

            :

            ""

        }



        <h3>
        ${capsule.title}
        </h3>



        <p>
        ${capsule.message.substring(0,100)}
        </p>




        <h4 class="
        ${unlocked ? "unlocked":"locked"}
        ">

        ${
            unlocked ?

            "🔓 Unlocked"

            :

            "🔒 " + remaining

        }


        </h4>





        <button
        onclick="openCapsule(${capsule.id})">

        View

        </button>



        <button
        class="delete-btn"
        onclick="deleteCapsule(${capsule.id})">

        Delete

        </button>



        </div>



        `;



    });



    updateStats();


}









/* =========================
   COUNTDOWN
========================= */


function getCountdown(date){



    const target =
    new Date(date).getTime();



    const now =
    new Date().getTime();



    let difference =
    target - now;



    if(difference <= 0){

        return "Unlocked";

    }





    let days =
    Math.floor(
        difference /
        (1000*60*60*24)
    );



    let hours =
    Math.floor(
        (difference %
        (1000*60*60*24))
        /
        (1000*60*60)
    );



    let minutes =
    Math.floor(
        (difference %
        (1000*60*60))
        /
        (1000*60)
    );



    return `${days} Days ${hours}h ${minutes}m`;



}







/* =========================
   DELETE CAPSULE
========================= */


function deleteCapsule(id){



    capsules =
    capsules.filter(
        capsule =>
        capsule.id !== id
    );



    localStorage.setItem(
        "capsules",
        JSON.stringify(capsules)
    );



    displayCapsules();


}








/* =========================
   OPEN CAPSULE MODAL
========================= */


function openCapsule(id){



    const capsule =
    capsules.find(
        c=>c.id===id
    );



    const unlocked =
    new Date() >=
    new Date(capsule.unlockDate);



    if(!unlocked){


        alert(
        "This capsule is still locked 🔒"
        );


        return;


    }




    document.getElementById(
        "modalContent"
    ).innerHTML = `


    <h2>
    ${capsule.title}
    </h2>


    ${
        capsule.image ?

        `<img 
        src="${capsule.image}"
        style="width:100%;border-radius:15px;">
        `

        :

        ""

    }



    <p>
    ${capsule.message}
    </p>



    <small>
    Created:
    ${new Date(
        capsule.createdAt
    ).toDateString()}
    </small>



    `;



    document.getElementById(
        "modal"
    ).style.display="flex";



}







function closeModal(){


    document.getElementById(
        "modal"
    ).style.display="none";


}







/* =========================
   STATISTICS
========================= */


function updateStats(){



    let total =
    capsules.length;



    let unlocked =
    capsules.filter(
        c =>
        new Date() >=
        new Date(c.unlockDate)
    ).length;



    let locked =
    total - unlocked;



    document.getElementById(
        "totalCapsules"
    ).innerText = total;



    document.getElementById(
        "lockedCapsules"
    ).innerText = locked;



    document.getElementById(
        "openedCapsules"
    ).innerText = unlocked;



}







/* =========================
   CLEAR FORM
========================= */


function clearForm(){


    document.getElementById(
        "title"
    ).value="";


    document.getElementById(
        "message"
    ).value="";


    document.getElementById(
        "unlockDate"
    ).value="";


    document.getElementById(
        "imageUpload"
    ).value="";


}







/* =========================
   SCROLL BUTTON
========================= */


function scrollToCreate(){


    document
    .getElementById("create")
    .scrollIntoView(
        {
            behavior:"smooth"
        }
    );


}







/* =========================
   THEME BUTTON
========================= */


document
.getElementById("themeBtn")
.onclick=function(){


    document.body.classList.toggle(
        "light"
    );


};







/* =========================
   LIVE COUNTDOWN REFRESH
========================= */


setInterval(
    displayCapsules,
    60000
);






/* INITIAL LOAD */


displayCapsules();