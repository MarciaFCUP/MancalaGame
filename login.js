//load entire code on a browser load
/*window.onload = function() {
    //your code

    //to do login

    function loginFunction(event) {
        event.preventDefault();

        var formData = new FormData(document.querySelector('login-form'))

        //document.getElementById("logInButton").innerHTML = "Welcome @name";
        //var user =  document.getElementById('username');
        console.log(formData)
    }

    document.getElementById("submit").addEventListener("click", function(event) {
        event.preventDefault()
            //var formData = new FormData(document.getElementById("login-form"))
        let myForm = document.getElementById('myForm');
        let formData = new FormData(myForm);
        data = data.entries();
        var obj = data.next();
        var retrieved = {};
        while (undefined !== obj.value) {
            retrieved[obj.value[0]] = obj.value[1];
            obj = data.next();
        }
        console.log('retrieved: ', retrieved);


    });

}; */