// let server = "";
// let headers = {
//   "Content-Type": "application/json",
// };

// function setBearer(token) {
//   headers = {
//     ...headers,
//     Authorization: `Bearer ${token}`,
//   };
// }

// function setServer(url) {
//   server = url;
// }

// async function fetcher(url, method, body = null) {
//   try {
//     const options = {
//       headers,
//       method,
//     };
//     if (body !== null) options.body = JSON.stringify(body);
//     const response = await fetch(server + url, options);
//     return await response.json();
//   } catch (error) {
//     console.error(error);
//   }
// }

// function get(url) {
//   return fetcher(url, "GET");
// }

// function post(url, body) {
//   return fetcher(url, "POST", body);
// }

// export { setServer, get, post, setBearer };
