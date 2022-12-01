'use strict';
let test = console.log;


class AddElement {
  constructor(name, tag) {
    this.obj = document.createElement(tag);
    this.obj.name = name;
  };

  elemProp(txt) {
    this.obj.innerHTML = txt;
    return this.obj;
  }

  elemImg(imgUrl) {
    this.obj.src = imgUrl;
    this.obj.height = 150;
    return this.obj;
  }
}

async function getJson(name) {

  let respData = await fetch(`https://api.github.com/users/${name}`);
  let respFollow = await fetch(`https://api.github.com/users/${name}/followers`);

  if (respData.status === 404) {
    let error = document.createElement('div');
    error.className = 'user_not_found';
    error.appendChild(
      new AddElement('notFound', 'h3').elemProp(`${name} does not exist.`)
    )
    document.body.append(error)
    throw Error('User not found!');
  } 
  else {
    let userData = await respData.json();
    let userFollow = await respFollow.json();
    test(userData)
    let user = {
      'name': userData.name,
      'login': userData.login,
      'avatar_url': userData.avatar_url,
      'bio': userData.bio,
      'location': userData.location,
      'fans': userFollow.map(fan => fan.login),
    }

    return user;
  }
}

async function gitUser(name) { 
  
  let prop = await getJson(name);

  let arr = [
    new AddElement('name', 'h2').elemProp(prop.name),
    new AddElement('userimg', 'img').elemImg(prop.avatar_url),
    new AddElement('login', 'h2').elemProp(prop.login),
    new AddElement('bio', 'h3').elemProp(prop.bio),
    new AddElement('location', 'h3').elemProp(prop.location),
  ]
  
  // create user div
  let user = document.createElement('div');
  user.className = 'user';
  arr.forEach(item => user.appendChild(item))
  document.body.append(user);

  // create list of followers
  let followers = document.createElement('div');
  let followersText = document.createElement('h2');
  followersText.innerHTML = 'Followers';
  followers.className = 'followers';
  followers.appendChild(followersText)
  document.body.append(followers);
  prop.fans.forEach(name => {
    let follower = document.createElement('p');
    follower.innerHTML = name;
    followers.appendChild(follower)
  })

  let info = document.createElement('div');
  info.className = 'info';
  document.body.append(info);
  info.appendChild(user);
  info.appendChild(followers);
}

// search element & functionality -------------------------------------

let search = document.getElementById('searchUser');
search.addEventListener('keyup', function(e) {
    if (e.key === 'Enter') {
      gitUser(search.value)
    } else if (search.value === '' || e.key === 'Backspace') {
      removeElem('info');
      removeElem('user_not_found');
    }
});
let searchDiv = document.createElement('div');
searchDiv.className = 'search';
document.body.append(searchDiv);
searchDiv.appendChild(search);

function removeElem(elem) {
  for (let i = 0; i < document.getElementsByClassName(elem).length; i++) {
    document.getElementsByClassName(elem)[i].remove();
  }
}

