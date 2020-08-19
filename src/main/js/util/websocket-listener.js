import SockJS from "sockjs-client";
import "stompjs";

function register(registrations) {
  const socket = SockJS("/properties");
  const stompClient = Stomp.over(socket);
  stompClient.connect({}, function (frame) {
    registrations.forEach(function (registration) {
      stompClient.subscribe(registration.route, registration.callback);
    });
  });
}

export default register;
