function show(id){
  document.querySelectorAll("section").forEach(s=>s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function shuffleArray(arr){
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
}

let doubts = new Set();
let demoOTP="";

function showSignUp(){ show("signupPage"); }
function showForgot(){ show("forgotPage"); }
function backToSignIn(){ show("authPage"); }

function signUp(){
  const name=suName.value;
  const pass=suPassword.value;
  const role=suRole.value;

  if(!name||!pass){ alert("Fill all fields"); return; }

  let users=JSON.parse(localStorage.getItem("users"))||{};
  if(users[name]){ alert("User exists"); return; }

  users[name]={password:pass,role};
  localStorage.setItem("users",JSON.stringify(users));
  alert("Account created");
  backToSignIn();
}

function signIn(){
  const name=authName.value;
  const pass=authPassword.value;

  let users=JSON.parse(localStorage.getItem("users"))||{};
  if(!users[name]||users[name].password!==pass){
    alert("Invalid login");
    return;
  }

  localStorage.setItem("user",JSON.stringify({name,role:users[name].role}));

  if(users[name].role==="Admin"){
    show("adminPage");
    loadAdmin();
  }else{
    startQuiz();
  }
}

function resetPassword(){
  const name=fpName.value;
  const pass=fpPassword.value;
  const otp=otpInput.value;

  let users=JSON.parse(localStorage.getItem("users"))||{};
  if(!users[name]){ alert("User not found"); return; }

  if(!demoOTP){
    demoOTP=Math.floor(100000+Math.random()*900000).toString();
    alert("Demo OTP: "+demoOTP);
    return;
  }

  if(otp!==demoOTP){ alert("Wrong OTP"); return; }

  users[name].password=pass;
  localStorage.setItem("users",JSON.stringify(users));
  demoOTP="";
  alert("Password reset successful");
  backToSignIn();
}

suPassword.addEventListener("input",()=>{
  const v=suPassword.value;
  if(v.length<6){ strength.innerText="Weak"; strength.className="weak"; }
  else if(/[A-Z]/.test(v)&&/\d/.test(v)){
    strength.innerText="Strong"; strength.className="strong";
  }else{ strength.innerText="Medium"; strength.className="medium"; }
});


const questions=[
{q:"HTML stands for?",o:["Hyper Text Markup Language","High Text Machine","Hyperlinks Text","Home Tool"],a:0},
{q:"CSS is used for?",o:["Styling","Logic","Database","Hosting"],a:0},
{q:"JS is?",o:["Programming language","Markup","DB","Server"],a:0},
{q:"Which tag for link?",o:["<a>","<link>","<href>","<url>"],a:0},
{q:"DOM means?",o:["Document Object Model","Data Object","Digital Object","None"],a:0},
{q:"Which is JS keyword?",o:["let","varr","define","int"],a:0},
{q:"CSS class selector?",o:[".","#","*","@"],a:0},
{q:"ID selector?",o:["#",".","&","$"],a:0},
{q:"Which is semantic?",o:["header","div","span","b"],a:0},
{q:"Flexbox used for?",o:["Layout","DB","Logic","Network"],a:0},
{q:"JS array add?",o:["push","pop","map","slice"],a:0},
{q:"Remove last element?",o:["pop","push","shift","add"],a:0},
{q:"LocalStorage stores?",o:["String","Object","Array","Number"],a:0},
{q:"POST is?",o:["Send data","Get data","Delete","None"],a:0},
{q:"Relative unit?",o:["em","px","cm","mm"],a:0},
{q:"Block element?",o:["div","span","a","img"],a:0},
{q:"img needs?",o:["src","href","alt","id"],a:0},
{q:"Strict compare?",o:["===","==","=","!="],a:0},
{q:"Promise state?",o:["pending","waiting","paused","none"],a:0},
{q:"JS error handler?",o:["catch","handle","error","throw"],a:0},
{q:"JSON to object?",o:["JSON.parse","JSON.stringify","convert","parseJSON"],a:0},
{q:"Rounded corners?",o:["border-radius","outline","shadow","radius"],a:0},
{q:"Frontend library?",o:["React","Node","Mongo","Express"],a:0},
{q:"Bundler?",o:["Webpack","Git","NPM","Docker"],a:0},
{q:"Arrow fn?",o:["()=>{}","function()","def()","=>()"],a:0},
{q:"Event on click?",o:["onclick","onhover","onload","onpress"],a:0},
{q:"HTTP delete?",o:["DELETE","POST","PUT","GET"],a:0},
{q:"CSS hover?",o:[":hover",":active",":click",":focus"],a:0},
{q:"JS loop?",o:["for","repeat","loop","iterate"],a:0},
{q:"Frontend role?",o:["UI","DB","Server","API"],a:0}
];

shuffleArray(questions);


let current=0;
let answers=Array(30).fill(null);
let viewed=new Set();
let time=1800;
let timer;

function startQuiz(){
  show("quizPage");
  loadQ();
  startTimer();
}

function loadQ(){
  viewed.add(current);
  question.innerText=questions[current].q;
  qInfo.innerText=`Question ${current+1}/30`;
  doubtBtn.classList.toggle("active", doubts.has(current));

  options.innerHTML="";
  let ops=questions[current].o.map((t,i)=>({t,i}));
  shuffleArray(ops);

  ops.forEach(o=>{
    let b=document.createElement("button");
    b.innerText=o.t;
    if(answers[current]===o.i) b.classList.add("selected");
    b.onclick=()=>{answers[current]=o.i; loadQ();}
    options.appendChild(b);
  });
}

function nextQ(){ if(current<29){current++; loadQ();} }
function prevQ(){ if(current>0){current--; loadQ();} }
updateStatus();

function startTimer(){
  timer = setInterval(()=>{
    let m = Math.floor(time / 60);
    let s = time % 60;

    timeEl.innerText = `${m}:${s.toString().padStart(2,"0")}`;
    time--;

    if(time < 0){
      clearInterval(timer);
      alert("Time is up! Your test will be submitted automatically.");
      submitQuiz();
    }
  }, 1000);
}

function submitQuiz(){
  clearInterval(timer);

  let score=0,attempted=0;
  answers.forEach((a,i)=>{
    if(a!==null){
      attempted++;
      if(a===questions[i].a) score++;
    }
  });

  let user=JSON.parse(localStorage.getItem("user"));
  let attempts=JSON.parse(localStorage.getItem("attempts"))||[];
  attempts.push({name:user.name,role:user.role,score});
  localStorage.setItem("attempts",JSON.stringify(attempts));

  resultBox.innerHTML=`
  Score: ${score}/30<br>
  Attempted: ${attempted}<br>
  Not Attempted: ${30-attempted}<br>
  Viewed: ${viewed.size}
  `;

  show("resultPage");
}


function loadAdmin(){
  const data=JSON.parse(localStorage.getItem("attempts"))||[];
  adminTable.innerHTML="";
  data.forEach(d=>{
    adminTable.innerHTML+=`<tr><td>${d.name}</td><td>${d.role}</td><td>${d.score}</td></tr>`;
  });
}

function downloadReport(){
  const t=localStorage.getItem("attempts");
  const a=document.createElement("a");
  a.href=URL.createObjectURL(new Blob([t]));
  a.download="report.txt";
  a.click();
}


function toggleTheme(){
  document.body.classList.toggle("dark");
  themeToggle.textContent =
    document.body.classList.contains("dark") ? "☀️" : "🌙";
}

function confirmSubmit(){
  const notAttempted = answers.filter(a => a === null).length;
  const confirmMsg = `You have ${notAttempted} unanswered questions.\nDo you really want to submit?`;

  if(confirm(confirmMsg)){
    submitQuiz();
  }
}
function updateStatus(){
  const attempted = answers.filter(a => a !== null).length;
  attCount.innerText = attempted;
  notAttCount.innerText = 30 - attempted;
  viewCount.innerText = viewed.size;
  notViewCount.innerText = 30 - viewed.size;
  doubtCount.innerText = doubts.size;
}
function toggleDoubt(){
  if(doubts.has(current)){
    doubts.delete(current);
    doubtBtn.classList.remove("active");
  }else{
    doubts.add(current);
    doubtBtn.classList.add("active");
  }
  updateStatus();
}
