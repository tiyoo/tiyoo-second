<?php


$name=$_POST['name'];
$email=$_POST['email'];
$phone=$_POST['phone'];
$subject=$_POST['subject'];
$message=$_POST['message'];


$to='inquiry@tiyoo.com';

$headers = 'From: '.$name."\r\n" .
	'Reply-To: '.$email."\r\n" .
	'X-Mailer: PHP/' . phpversion();
$subject = $subject;
$body='You have got a new message from the contact form on your website.'."\n\n";

$body.='Name: '.$name."\n";
$body.='Email: '.$email."\n";
$body.='Phone: '.$phone."\n";
$body.='Subject: '.$subject."\n";
$body.='Message: '."\n".$message."\n";
	
if(mail($to, $subject, $body, $headers)) {
	die('Message sent');
} else {
	die('Error: Mail failed');
}

?>