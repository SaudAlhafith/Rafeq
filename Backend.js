// Validate the form before submitting
function validateForm() {
    // Check if the username is empty
    if (document.getElementById("username").value === "") {
      alert("الرجاء إدخال اسم مستخدم.");
      return false;
    }
  
    // Check if the email is valid
    if (!/^\w+@\w+\.\w+$/.test(document.getElementById("email").value)) {
      alert("الرجاء إدخال عنوان بريد إلكتروني صالح.");
      return false;
    }
  
    // Check if the passwords match
    if (document.getElementById("password").value !== document.getElementById("confirm-password").value) {
      alert("كلمة المرور غير متطابقة.");
      return false;
    }
  
    return true;
  }
  
  // Submit the form when the user clicks on the "Register" button
  document.getElementById("submit").onclick = function() {
    if (validateForm()) {
      // Do something with the form data
    }
  };
  