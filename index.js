var MyForm = {};

MyForm.validate = function() {
    var res = {};

    var emailgood = isEmail();
    var fiogood = isFio();
    var phonegood = isPhone();

    res.isValid = true;
    res.isValid = emailgood&&fiogood&&phonegood;

    res.errorFields = [];

    if(!emailgood) {
        res.errorFields[res.errorFields.length] = "email";
    }

    if(!fiogood) {
        res.errorFields[res.errorFields.length] = "fio";
    }

    if(!phonegood) {
        res.errorFields[res.errorFields.length] = "phone";
    }

    return res;
}

MyForm.getData = function() {
    var object = {};

    var myForm = document.forms["myForm"];

    object.email = myForm.elements["email"].value;
    object.fio = myForm.elements["fio"].value;
    object.phone = myForm.elements["phone"].value;

    return object;
}

MyForm.setData = function(object) {

    if("email" in object) {
        myForm.elements["email"].value = object.email;
    }
    if("fio" in object) {
        myForm.elements["fio"].value = object.fio;
    }
    if("phone" in object) {
        myForm.elements["phone"].value = object.phone;
    }
}

var form;

MyForm.submit = function() {
    request(form);
}

$(document).ready(function() {
	$("#myForm").submit(function() {
        form = $(this);
        MyForm.submit();
		return false;
	});
});

function request() {
    if (isGoodRequest()) {

        var data = JSON.stringify(MyForm.getData());
        var addr = form.attr("action");

        $.ajax({
            type: 'GET',
            url: addr,
            dataType: 'json',
            data: data, 
            beforeSend: function(data) {
                form.find('button').attr('disabled', 'disabled');
                },
            success: function(response){
                if (response['error']) {
                    alert(response['error']);
                    error(response['error']);
                } else { 
                    // анализируем ответ
                    var result = document.getElementById("resultContainer");

                    if("status" in response) {
                        if(response.status == "success") {

                            result.setAttribute('class','success');
                            result.innerHTML = "Success";

                            form.find('button').prop('disabled', false);

                        } else if(response.status == "error") {

                            result.setAttribute('class','error');

                            if("reason" in response) {
                                result.innerHTML = response.reason;
                            }

                            form.find('button').prop('disabled', false);

                        } else if(response.status == "progress") {
                            
                            result.setAttribute('class','progress');
                            result.innerHTML = "Progress";

                            if("timeout" in response) {
                                setTimeout(request, parseInt(response.timeout),form);
                            } else {
                                form.find('button').prop('disabled', false);
                            }
                        }
                    }
                }
            },

            error: function (xhr, ajaxOptions) {
                alert(xhr.status);
                error(xhr.status);
            }                        
        });
    } else {

    }
}

function error(err) {
    var result = document.getElementById("resultContainer");

    result.setAttribute('class','error');
    result.innerHTML = err;
    form.find('button').prop('disabled', false);
}

function isGoodRequest() {

    var res = MyForm.validate();

    if(res.isValid) {
        // можно отправлять запрос
        return true;

    } else {
        // ошибка
        var str = res.errorFields;

        if(/email/.test(str)) {
            document.getElementById("email").setAttribute('class','error');
        }
        if(/fio/.test(str)) {
            document.getElementById("fio").setAttribute('class','error');
        }
        if(/phone/.test(str)) {
            document.getElementById("phone").setAttribute('class','error');
        }
    }

    return false;
}

function isFio() {

    var str = document.getElementById("fio").value;
    var input = document.getElementById("fio");

    input.removeAttribute('class');

	str = str.replace(/(^\s*)|(\s*$)/gi,"");
	str = str.replace(/[ ]{2,}/gi," ");
    str = str.replace(/\n /,"\n");
    
    if(str.split(' ').length == 3) {
        return true;
    }
    
    return false;
}

function isEmail() {

    var str = document.getElementById("email").value;
    var input = document.getElementById("email");

    input.removeAttribute('class');

    var re = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;
    var domen = /@ya.ru|@yandex.ru|@yandex.ua|@yandex.by|@yandex.kz|@yandex.com/;

    if (re.test(str) && domen.test(str)) {
        return true;
    } else {
        return false;
    }
}

function isPhone() {

    var str = document.getElementById("phone").value;
    var input = document.getElementById("phone");

    input.removeAttribute('class');

    var ph = /\+7\(\d{3}\)\d{3}-\d{2}-\d{2}/;

    var summ = 0;

    if(ph.test(str)) {
        for(var i = 0; i < str.length; i++) {
            if(isNumeric(str[i])) {
                summ += parseInt(str[i]);
            }
        }

        if(summ <= 30) {
            return true;
        }
    }

    return false;
}

function isNumeric(value) {
    return /^\d+$/.test(value);
}
