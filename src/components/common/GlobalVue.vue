<template>
</template>

<script>
	var userToken = localStorage.getItem("userToken");
	var reqHeader =  function (XMLHttpRequest) {
		XMLHttpRequest.setRequestHeader("X-Token", userToken);
		XMLHttpRequest.setRequestHeader("Login-Channel", "web");
	}
</script>

<style>
</style>