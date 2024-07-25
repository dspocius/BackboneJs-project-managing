self.addEventListener("install", event => {
   console.log("Service worker installed");
});
self.addEventListener("activate", event => {
   console.log("Service worker activated");
});
self.addEventListener('push', function(event) {
    console.log('Received a push message', event);

  fetch("/commentsU/notificationsForUser/0/true", {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then((response)=> response.json())
  .then((datago) => {
	  console.log("ASAAA",datago);
	  if (datago) {
		  let msgs = datago.messages;
		  let filtermsg = msgs.filter(itm => itm.message == "!__CALLING__!");
		  console.log("ASD",filtermsg);
		  if (filtermsg.length > 0) {
			  let ufnamee = filtermsg[0].from;
			  if (ufnamee && ufnamee.split("___").length > 1) {
				   ufnamee = ufnamee.split("___")[1];
			  }
			  console.log("ASssD",ufnamee);
			  event.waitUntil(
					self.registration.showNotification(ufnamee+" is calling ...", {
						body: "Answer it"
					})
				);
		  } else {
			  let fall = msgs.filter(itm => itm.message != "!__CALLING__!");
			  if (fall.length > 1) {
				  event.waitUntil(
						self.registration.showNotification("You have "+fall.length+" messages", {
							body: "Check it"
						})
					);
			  } else {
				  let ufname = fall[fall.length-1].from;
				  if (ufname && ufname.split("___").length > 1) {
					   ufname = ufname.split("___")[1];
				  }

				  event.waitUntil(
						self.registration.showNotification(ufname, {
							body: fall[fall.length-1].message
						})
					);
			  }
		  }
	  }
  });

/*
  fetch("/checkifuserloggedin", {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then((response)=> response.json())
  .then((datago) => {
	  console.log("ASD",datago);
	  if (datago && datago.username) {
		   fetch("/user/"+datago.username, {
			method: 'GET',
			headers: {
			  'Content-Type': 'application/json'
			},
		  })
		  .then((response)=> response.json())
		  .then((datauser) => {
			  if (datauser) {
				  let loadeduser = JSON.parse(datauser);
				  console.log("USERIS",loadeduser);
				  if (loadeduser && loadeduser._id && loadeduser.notifications > 0) {
					   fetch("/messages/"+loadeduser._id+"/"+loadeduser._id, {
						method: 'GET',
						headers: {
						  'Content-Type': 'application/json'
						},
					  })
					  .then((response)=> response.json())
					  .then((notifsgo) => {
						  let alluse = 5;//loadeduser.notifications;
						  if (notifsgo) {
							  let notgo = [];
							  let msgs = notifsgo.messages;
							  if (alluse > 1) {
								  event.waitUntil(
										self.registration.showNotification("You have "+alluse+" notifications", {
											body: "Check it"
										})
									);
							  } else {
								  event.waitUntil(
										self.registration.showNotification(msgs[msgs.length-1].from, {
											body: msgs[msgs.length-1].message
										})
									);
							  }
						  }
					  }).catch(error => {
						console.error(error)
					  });
				  }
			  }
		  }).catch(error => {
			console.error(error)
		  });
	  }
	  
	  
  }).catch(error => {
    console.error(error)
  });
*/
});
self.addEventListener('message', (event) => {
    console.log('Received a push message', event);

  if (event.data && event.data.type === 'MESSAGE_IDENTIFIER') {
    var icon = '/images/icon-192x192.png';
    event.waitUntil(
    self.registration.showNotification(event.data.title, {
        body: event.data.body,
        icon: icon,
        tag: 'simple-push-demo-notification-tag'
    })
    );
  }
});
