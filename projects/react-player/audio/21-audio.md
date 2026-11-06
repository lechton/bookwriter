---
chapter: 21
voice: Enzo
style: breath
---

<!-- block title-001 | src: "21 lecture 21 react 19 foundations reacting to" -->
Lecture twenty-one. <pause> Reacting to Input with State.

<!-- block question-001 | src: "interview question core how do you design a" -->
And here's the interview question this whole lecture is building toward. It's a core one. <breath> How do you design a component that reacts to input with state... instead of touching the DOM?

<!-- block h2-001 | src: "overview why we describe each look instead of" -->
<pause> We'll start with the big picture. <pause> Why we describe each look, instead of changing the page by hand.

<!-- block h3-001 | src: "one subscribe button written two ways" -->
One Subscribe button... written two ways.

<!-- block p-001 | src: "many pages have a button that changes the" -->
Many pages have a button that changes the page when you click it. <breath> Here is the smallest one we can think of. When the page opens... it shows one Subscribe button.

<!-- block fig-001 | src: "localhost 5173 subscribe figure 1 a small page" -->
And that's figure one. A browser window, with localhost five one seven three up in the address bar. <pause> Inside it, one button that says Subscribe. That's the whole page, nothing else on it.

<!-- block p-002 | src: "one click should change two things first the" -->
<breath> One click should change two things. First, the button should turn off... so nobody subscribes twice. <pause> Second, a line that says Thanks! should appear under it.

<!-- block p-003 | src: "we can build this in two ways the" -->
We can build this in two ways. The first way uses plain JavaScript, with no React at all. <breath> The HTML file holds the button, and a thank-you line that starts hidden.

<!-- block code-001 | src: "index html 1 button id subscribe subscribe button" -->
Okay, so this is index dot html. Two lines, that's all. <pause> Line one is our button. Its id is subscribe, and the word on it is Subscribe. <breath> Line two is a paragraph, with the id thanks and the text Thanks! But it also carries a class... called hidden. <pause> Keep that word in mind for a second.

<!-- block p-004 | src: "the word hidden is our own css class" -->
The word hidden is our own CSS class. <pause> Our stylesheet gives it one rule: display, none. <breath> That rule tells the browser not to show any element that has this class. So when the page opens, the thank-you line is in the HTML... <pause> but the user cannot see it.

<!-- part -->

<!-- block p-005 | src: "next a small script tells the button what" -->
Next... a small script tells the button what to do on a click.

<!-- block code-002 | src: "subscribe js 1 const button document getelementbyid subscribe" -->
Here, in subscribe dot js, the first two lines go and find our elements. <pause> Line one asks the document for the element with the id subscribe, and keeps it as button. Line two does the same for thanks. <breath> Then line four tells the button to listen for a click, and hands it a small function. Inside that function there are two commands. Line five sets button dot disabled to true... that's command one, turn the button off. <pause> Line six takes the hidden class off the thank-you line. Command two. And line seven just closes everything up.

<!-- block p-006 | src: "we met document getelementbyid in lesson 1 the" -->
We met document dot get element by id in Lesson one. The browser gives it to us. <pause> It finds the element whose id attribute matches the text we pass. <breath> And we met add event listener in Lesson four. It hands our function to the browser... and the browser calls that function on every click.

<!-- block p-007 | src: "two words inside the click handler are new" -->
<pause> Two words inside the click handler are new. Both come from the browser.

<!-- block list-001 | src: "disabled is a property of every button and" -->
First word: disabled. It's a property of every button and every text box. When our code sets it to true, the element ignores clicks and typing... and it looks dimmed. When our code sets it back to false, the element works again. <pause> The second one is class list, the list of CSS classes on an element. <breath> Its remove method takes a class off, so taking hidden off makes the element show again. And its add method puts a class on, so putting hidden back makes the element hide again.

<!-- block p-008 | src: "the second way uses react the whole page" -->
<pause> The second way uses React. And the whole page is one small component.

<!-- block code-003 | src: "subscribe jsx 1 import usestate from react 2" -->
What's different in Subscribe dot jsx? Well, no element is looked up by id at all. <pause> Line one imports use state from React. Line three starts our component, Subscribe. <breath> Line four makes a piece of state called done, with its setter, set done... and it starts as false. Then on line seven, the button gets disabled equals done, in curly braces, and its on click calls set done with true. The note there says it's off when done is true. <pause> Line eight is done, the double ampersand, and then a paragraph that says Thanks! That one is shown only when done is true. <breath> And the empty tags on lines six and nine just wrap the two together.

<!-- block p-009 | src: "here done is a piece of state and" -->
So here, done is a piece of state, and it starts as false. The button gets disabled equals done, in curly braces. <pause> As we saw in Lesson three, the curly braces pass the value of done itself. So at the start, the button gets disabled equals false... and it works. <breath> The line under the button uses the double ampersand from Lesson ten. At the start, the double ampersand gives false, and React creates nothing for it. <pause> So there is no thank-you line on the page at all.

<!-- block p-010 | src: "now the user clicks subscribe once both versions" -->
<pause> Now the user clicks Subscribe once. Both versions give the same page.

<!-- block fig-002 | src: "localhost 5173 subscribe thanks figure 2 the same" -->
Figure two is that page after the click. Same browser window, same address. <pause> But the Subscribe button now looks dimmed, it's disabled... and right under it, the line Thanks! is showing.

<!-- block p-011 | src: "the page is the same but the way" -->
The page is the same. <pause> But the way we got there is very different. <breath> Here is what the plain version does, in order.

<!-- block list-002 | src: "the user clicks subscribe and the browser calls" -->
It starts when the user clicks Subscribe, and the browser calls our function. Then the first line of the function sets disabled to true, so the button turns off. <pause> And the second line takes hidden off the thank-you line... so the line shows.

<!-- block p-012 | src: "and here is what the react version does" -->
<pause> And here is what the React version does, in order.

<!-- block list-003 | src: "the user clicks subscribe and react calls the" -->
Same click, but a longer story. The user clicks Subscribe, and React calls the function in on click. That function calls set done with true. <pause> The setter stores true in done, and asks React to draw the component again. So React calls Subscribe again... and this time, done is true. <breath> That means the JSX now says disabled equals true, in curly braces, for the button. And the double ampersand now gives the thank-you paragraph. <pause> React compares this result with the last one, as we saw in Lesson thirteen. It finds two differences. So it turns the button off, and adds the paragraph to the page.

<!-- block p-013 | src: "look at what each click handler talks about" -->
Now look at what each click handler talks about. <pause> The plain handler names both elements, and tells each one what to do. If one more element had to change on the click, the plain handler would need one more line. <breath> The React handler names no element at all. It changes one value... done. The JSX already says how the page looks when done is true. <pause> And React does the work of changing the page.

<!-- block p-014 | src: "in lesson 1 we gave these two styles" -->
In Lesson one, we gave these two styles their names.

<!-- block list-004 | src: "imperative code gives a command for every step" -->
Two names, then. Imperative code gives a command for every step... turn this off, show that. <pause> Declarative code describes the result. When done is true, the button is off, and the thank-you line is there.

<!-- block p-015 | src: "think of a car ride across a city" -->
<breath> Think of a car ride across a city. In the imperative style, you sit next to the driver and call out every turn. Left here... right at the bakery... straight on to the bridge. <pause> In the declarative style, you get into a taxi and say only the address. The taxi driver knows the streets, and finds the way. <pause> In React, the handler says the address... and React is the driver.

<!-- block h3-002 | src: "a promo code box that has five looks" -->
<pause> Now, a promo code box... that has five looks.

<!-- block p-016 | src: "the subscribe button has only two looks before" -->
The Subscribe button has only two looks. Before the click, and after it. <pause> Real forms have more. Look at the checkout page of any online shop. Under the cart, there is often a small box called Promo code. <breath> You type a code and click Apply. Then the shop's server checks the code.

<!-- block p-017 | src: "while the server checks the page says checking" -->
While the server checks, the page says Checking... and you cannot click Apply again. <pause> If the code is wrong, a red line says the code is not valid. If the code is right, the box goes away, and a line says the discount was applied. <breath> So this small box has five looks over time. Empty, typed, checking, refused... and accepted.

<!-- block p-018 | src: "in plain javascript every change from one look" -->
In plain JavaScript, every change from one look to another needs its own commands. Show this line, hide that one, turn the button off, turn it back on. <pause> With five looks, there are many changes to cover. <breath> And if you forget one command... the page ends up in a look that nobody designed.

<!-- block p-019 | src: "in this lesson we build that promo code" -->
In this lesson, we build that promo code box twice. <pause> First, we build it in plain JavaScript, and we watch one forgotten command break the page. <breath> Then we build it in React. There, we describe each look once... and let state decide which look is on the screen.

<!-- part -->

<!-- block h3-003 | src: "the promo code box in this lesson" -->
<pause> So, the promo code box we'll build.

<!-- block p-020 | src: "our page is the promo code box of" -->
Our page is the Promo code box of an online shop. It has a heading, a text box, and an Apply button. <pause> Under them, one of three lines can appear.

<!-- block list-005 | src: "checking while the server checks the code a" -->
There's Checking... while the server checks the code. <pause> There's a red line, This code is not valid, when the server says no. <pause> And there's Code applied! You get free delivery... when the server says yes.

<!-- block p-021 | src: "we have no real server instead a small" -->
We have no real server. <pause> Instead, a small function of ours plays the server. It waits one and a half seconds. <breath> Then it says yes to the code Welcome... and no to every other code.

<!-- block p-022 | src: "our shopper follows a very normal path first" -->
Our shopper follows a very normal path. <pause> First, the shopper types Welcom, with the last letter missing, and the code is refused. <breath> Then the shopper fixes the typo to Welcome, and the code is accepted.

<!-- block h3-004 | src: "what this lesson stands on" -->
<pause> What this lesson stands on.

<!-- block p-023 | src: "this lesson uses these facts from earlier lessons" -->
This lesson uses these facts from earlier lessons.

<!-- block list-006 | src: "imperative and declarative imperative code commands each element" -->
It's a long list, so let's go through it calmly, one lesson at a time. <pause> From Lesson one, imperative and declarative. Imperative code commands each element step by step, and declarative code describes the result. <pause> From Lesson two, fragments. The empty tags, the open one and the closing one, group several elements without adding an extra box to the page. <pause> From Lesson three, curly braces in an attribute. They pass a JavaScript value. So disabled equals false, in curly braces, passes the value false... and the button works. <breath> From Lesson nine, a default value for a prop. Writing status equals empty, in quotes, among the props, gives the prop the value empty when the parent passes nothing. <pause> From Lesson ten, choosing what to show. An if with an early return, the question mark and colon ternary, and the double ampersand decide what a component shows. And React creates no page element for null or false. <breath> From Lesson eleven, sending a form. On submit, on a form, runs our handler. React passes the handler an event object, e. And calling its prevent default method stops the page from reloading. <pause> From Lesson twelve, state. Use state keeps a value between renders. Its setter stores a new value, and asks React to draw the component again. <pause> From Lesson thirteen, render and commit. After a state change, React draws the component again. Then it changes only the parts of the page that differ from last time. <breath> From Lesson fifteen, waiting. Set timeout runs a function later, after a wait in milliseconds. <pause> From Lesson sixteen, batching. React handles the state changes of a handler after the handler's code has run. <pause> From Lesson eighteen, lists. Map, with a key, draws one element for each item of an array. <breath> And last, from Lesson twenty, a controlled box. Value equals code, in curly braces, makes the box show what state holds. And an on change handler that calls set code with the new text... stores every keystroke in state.

<!-- block h3-005 | src: "how our project files are organized" -->
<pause> And how our project files are organized.

<!-- block p-024 | src: "our project holds both versions of the promo" -->
Our project holds both versions of the promo code box. <pause> The plain page and the React page each have their own HTML file. <breath> And both use the same fake server.

<!-- block fig-003 | src: "promo code file explorer file directory role architectural" -->
In figure three, we're looking at a file explorer for the project, promo code, with each file's role next to it. <pause> At the top sit the two entry files. Plain dot html is the plain page, the promo form written in HTML, and it loads plain promo dot js from the src folder. Index dot html is the React page, with the empty root div where React mounts. <breath> Then comes the src folder, which holds the modules. Check code dot js is the fake server. It exports check code, which accepts only Welcome, after one and a half seconds. <pause> Plain promo dot js is the plain version. It finds every element by its id, and changes it by hand. Index dot css holds the styles, the hidden, error, and code box error classes. <breath> Main dot jsx is the boundary. It imports App from App dot jsx, and mounts it into the root div. App dot jsx is the parent. It exports App as default, and imports Promo Code. <pause> And inside the components folder, Promo Code dot jsx holds the state, code and status... and draws the promo code box. <pause> So the plain page and the React page sit side by side, in one project.

<!-- block h3-006 | src: "five principles of reacting to input with state" -->
<pause> The five principles of reacting to input with state.

<!-- block box-001 | src: "principles a page that changes in several ways" -->
So let's gather it all up. <pause> A page that changes in several ways over time is hard to keep right, when our code changes each element by hand. React lets us describe every look once... and pick the look with state. <breath> Five practical rules follow from that. <pause> Principle one. One forgotten command breaks the page. Plain page code needs a command for every change from one look to another. And one forgotten command leaves the page in a look nobody designed. <pause> Principle two. List every look first. Before writing any logic, list every look the user can see. Then draw each look from one value. <breath> Principle three. Find every trigger. Some changes come from the user. Others come from the computer, such as a server's answer. Both kinds must set state. <pause> Principle four. One status, instead of many switches. One value that names the current look cannot be in two looks at once. Several true or false values... can. <breath> And principle five. Handlers only set the next state. The handler says which look comes next. The JSX already says what each look shows... and React changes the page to match.

<!-- block p-025 | src: "here is the complete map of those five" -->
Here is the complete map of those five principles, before we walk through each one.

<!-- block table-001 | src: "principle why it matters in debugging and interviews" -->
Each row of this table gives one principle, then why it matters when you debug or sit an interview, and then the React rule. <pause> Row one, one forgotten command breaks the page. A refused code and then an accepted code can leave the error line and the success line on screen together... with no message in the Console. <breath> The rule, describe the page for each look once, and let the handler change only state. <pause> Row two, list every look first. A forgotten waiting look leaves the form working while the server checks, so an impatient shopper sends the code twice. The rule, write down every look, and draw each one from one value before adding any logic. <pause> Row three, find every trigger. A handler that waits for the server but never plans for a no... leaves the page stuck on its waiting look. <breath> The rule, list what the user does and what the computer does, and make each one set state. <pause> Row four, one status instead of many switches. Two true or false values can both be true, so the page shows an error while the box stays off. The rule, keep one value that names the look, and compute everything else from it, or from other state. <pause> And row five, handlers only set the next state. Changing the page by hand inside a React component can leave a button off forever... because React only changes what differs from its last render. <breath> The rule, let the handler call a setter, and let the JSX decide what is shown, turned off, or styled.

<!-- part -->

<!-- block h2-002 | src: "section 1 principle 1 one forgotten command breaks" -->
<pause> Section one. Principle one. <pause> One forgotten command breaks the page.

<!-- block h3-007 | src: "every new element means one more command" -->
Every new element... means one more command.

<!-- block p-026 | src: "let us go back to the subscribe button" -->
Let's go back to the Subscribe button for a moment. <breath> Suppose the page also has a short note under the button. It says, Get one email a week. <pause> And that note should go away after the click.

<!-- block p-027 | src: "in the plain version the note gets its" -->
In the plain version, the note gets its own id in the HTML. <pause> Our script finds it with document dot get element by id... and keeps it in a variable called note, the same way it found the button. <breath> Then the click handler needs a third command.

<!-- block code-004 | src: "subscribe js 5 button addeventlistener click 6 button" -->
The plain script again, subscribe dot js. Line five hands the button a click listener, a small arrow function. <pause> Inside it, line six sets button dot disabled to true. Line seven takes the class hidden off the thanks line. <breath> And line eight is the new one... note dot class list dot add, hidden. The note on that line says it plainly: new command three, hide the note. <pause> Line nine just closes the function.

<!-- block p-028 | src: "in the react version the handler stays exactly" -->
In the React version, the handler stays exactly as it was. <pause> Only the JSX gets one more piece... a piece that reads done.

<!-- block code-005 | src: "subscribe jsx 6 7 button disabled done onclick" -->
What changed in Subscribe dot jsx? <pause> Look at line seven first. The button still has disabled equals done, and on click it calls set done with true. The note there says, the handler did not change. <breath> Line eight is new. In curly braces, an exclamation mark, done, the double ampersand, and then a paragraph with Get one email a week. Its note says, shown only while done is false. <pause> Line nine is the old one, done, the double ampersand, Thanks! And lines six and ten are the empty fragment tags wrapped around it all.

<!-- block p-029 | src: "the exclamation mark in done means not at" -->
The exclamation mark in front of done means not. <pause> At the start, done is false... so not done is true, and the note shows. <breath> After the click, done becomes true. Then not done is false, and the note goes away.

<!-- block p-030 | src: "so each new element costs the plain handler" -->
So each new element costs the plain handler one more command. <pause> It costs the React handler... nothing.

<!-- block p-031 | src: "with one click and two looks the plain" -->
With one click and two looks, the plain version is still easy to keep right. <breath> Now let's build the promo code box... which has five looks.

<!-- block h3-008 | src: "the fake server a function that answers later" -->
<pause> The fake server. A function that answers later.

<!-- block p-032 | src: "before we write the plain page we need" -->
Before we write the plain page, we need our fake server. <pause> It lives in its own file.

<!-- block code-006 | src: "src checkcode js 1 export function checkcode code" -->
This file is check code dot js, in the src folder. <pause> Line one exports a function called check code, and it takes a code. <breath> Line two returns a new Promise, which gets resolve and reject. The note says, an answer that is not here yet. <pause> Line three starts a set timeout. Line four asks... is the code exactly Welcome? If it is, line five calls resolve. The answer is yes. <breath> Otherwise, line seven calls reject, with a new Error that says, This code is not valid. The answer is no. <pause> And on line nine, the number fifteen hundred tells set timeout how long to wait. Lines ten and eleven close everything up.

<!-- block p-033 | src: "a real server does not answer right away" -->
A real server does not answer right away. <pause> Its answer comes back a moment later. <breath> JavaScript has an object for exactly this case. It's called a Promise. <pause> A promise is a JavaScript object that stands for an answer that is not here yet.

<!-- block p-034 | src: "think of a burger counter that gives you" -->
Think of a burger counter that gives you a buzzer when you order. <pause> You get the buzzer right away... but the burger comes later. <breath> When the buzzer goes off, it tells you one of two things. Your order is ready. <pause> Or, sorry, we're sold out. <pause> A promise is that buzzer.

<!-- block p-035 | src: "when javascript creates a new promise it calls" -->
When JavaScript creates a new promise, it calls the small function we pass in. <breath> It hands that function two other functions, resolve and reject. <pause> Calling resolve means the answer is yes. Calling reject means the answer is no.

<!-- block p-036 | src: "the three equals signs in code welcome ask" -->
The three equals signs, in code, three equals signs, Welcome... ask JavaScript whether two values are exactly the same. <pause> The answer is true, or false.

<!-- block p-037 | src: "here is what checkcode does step by step" -->
Here is what check code does, step by step.

<!-- block list-007 | src: "it returns a new promise right away the" -->
First, it returns a new promise right away. The answer is not known yet. <pause> Then, inside the promise, set timeout waits fifteen hundred milliseconds... which is one and a half seconds. <breath> If the code is exactly Welcome, it calls resolve. The answer is yes. <pause> Otherwise, it calls reject. The answer is no. <breath> We pass reject a new Error, which is a standard JavaScript error object. Ours carries the message, This code is not valid.

<!-- block h3-009 | src: "the plain promo page" -->
<pause> The plain promo page.

<!-- block p-038 | src: "now the plain page the html loads our" -->
Now, the plain page. <pause> The HTML loads our stylesheet and holds the whole form. <breath> Every element has an id... so our script can find it.

<!-- block code-007 | src: "plain html 1 link rel stylesheet href src" -->
Ten lines in plain dot html. <pause> Line one links our stylesheet, index dot css, from the src folder. Line two opens a form with the id promo form, and line three is its heading, Promo code. <breath> Line four is the input box, code input. Line five is the Apply button, apply button, and notice the word disabled sitting on it. <pause> Line six is the Checking... line, with the class hidden. Line seven closes the form. <breath> Then, outside the form, line eight is the error line, with two classes, error and hidden, and the text This code is not valid. Line nine is the success line, also hidden. It says, Code applied! You get free delivery. <pause> And line ten loads our script, plain promo dot js, as a module.

<!-- block p-039 | src: "in html writing disabled on a tag turns" -->
In HTML, writing disabled on a tag turns the element off from the start. <pause> It's the same switch as the disabled property our script can set. <breath> So the Apply button starts off... because the box starts empty.

<!-- block p-040 | src: "the checking line the error line and the" -->
The Checking... line, the error line, and the success line all start with the class hidden. <pause> The error line also has the class error, which our stylesheet colors red.

<!-- block p-041 | src: "the error line and the success line sit" -->
The error line and the success line sit outside the form. <pause> There's a reason for that. <breath> After a success, we will hide the whole form. If the success line were inside the form... it would hide too.

<!-- block p-042 | src: "the script starts by finding every element it" -->
The script starts by finding every element it will change.

<!-- block code-008 | src: "src plain promo js 1 import checkcode from" -->
Line one brings in check code, imported from check code dot js. <pause> Line two is empty. <breath> Then lines three to eight all do the same thing, six times. Each one calls document dot get element by id, and keeps what it finds in a const. <pause> Form gets promo form. Code input gets code input. Apply button gets apply button. <breath> Checking text gets checking, error text gets error... and success text gets success.

<!-- block p-043 | src: "each of these six names is our own" -->
Each of these six names is our own variable. <pause> Each one holds one element of the page, found by the id we wrote in the HTML.

<!-- block p-044 | src: "while the shopper types the apply button should" -->
While the shopper types, the Apply button should work only when the box has text.

<!-- block code-009 | src: "src plain promo js 10 codeinput addeventlistener input" -->
Just three lines this time, ten to twelve. <pause> Line ten gives code input a listener for the input event. <breath> Line eleven is the highlighted one. Apply button dot disabled gets code input dot value dot length, three equals signs, zero. The note says, off while the box is empty. <pause> Line twelve closes it.

<!-- block p-045 | src: "the browser fires the input event on every" -->
The browser fires the input event on every keystroke... and it calls our small function each time. <breath> Inside it, code input dot value is the text in the box right now. <pause> Its length is the number of letters in that text.

<!-- block p-046 | src: "the highlighted line looks dense so here it" -->
The highlighted line looks dense. <pause> So here it is, in order.

<!-- block list-008 | src: "javascript reads the text in the box and" -->
JavaScript reads the text in the box, and counts its letters. <pause> Next, it checks whether that count is exactly zero. The answer is true or false. <breath> And it stores that answer in apply button dot disabled.

<!-- block p-047 | src: "so when the box is empty the answer" -->
So when the box is empty, the answer is true, and the button is off. <pause> As soon as the box holds one letter... the answer is false, and the button works.

<!-- part -->

<!-- block h3-010 | src: "waiting for the server inside a handler" -->
<pause> Waiting for the server, inside a handler.

<!-- block p-048 | src: "the last part of the script runs when" -->
The last part of the script runs when the shopper clicks Apply. <breath> It has to wait for the fake server... so it uses five JavaScript words we haven't met yet.

<!-- block code-010 | src: "src plain promo js 14 async function handlesubmit" -->
This is the longest piece so far, so let's take it slowly. <pause> Line fourteen declares an async function, handle submit, that gets e. Async, says the note, means this function may wait. <breath> Line fifteen calls e dot prevent default. Lines sixteen and seventeen turn off the box and the button, and line eighteen takes hidden off the checking text. <pause> Line nineteen opens try. The note there says, run this part, and if it fails, jump to catch. <breath> Line twenty is the await. It waits for check code, with the value in the box. Wait here for the answer. <pause> If the answer is yes, line twenty-one shows the success text, and line twenty-two hides the whole form. <breath> Line twenty-three is catch, the server said no, and line twenty-four shows the error text. <pause> Then line twenty-five, finally, which runs after try or catch, whichever happened. Line twenty-six hides the checking text again, and lines twenty-seven and twenty-eight turn the box and the button back on. <breath> And down on line thirty-two, form dot add event listener, submit, handle submit.

<!-- block p-049 | src: "all five words come from javascript" -->
All five words come from JavaScript.

<!-- block list-009 | src: "async in front of a function means the" -->
Let's go through them one by one. <pause> Async, in front of a function, means the function is allowed to wait. Only an async function may use await. <breath> Await pauses the function at that line, until the promise has its answer. Here it waits for the promise that check code returns. <pause> While the function waits, the browser keeps the page alive... so the shopper can still scroll. When the answer is yes, the function goes on with the next line. <breath> Then try and catch, which work as a pair. JavaScript runs the code inside try. If something there fails, JavaScript stops at that point, and jumps into catch. <pause> A promise that says no counts as a failure at its await. <breath> We write catch with no name after it, because this handler doesn't need the error object. <pause> And last, finally. It runs at the end in both cases... after try finished, or after catch ran.

<!-- block p-050 | src: "on the last line addeventlistener hands handlesubmit to" -->
On the last line, add event listener hands handle submit to the browser. <pause> The word submit names the event. <breath> The browser fires it when the form is sent, which happens when the shopper clicks Apply. <pause> Just like React in Lesson eleven, the plain browser passes the handler an event object, e. <breath> And here too, calling its prevent default method stops the page from reloading.

<!-- block h3-011 | src: "the first try welcom is refused" -->
<pause> The first try. Welcom, without the last E... is refused.

<!-- block p-051 | src: "the shopper types welcom and clicks apply for" -->
The shopper types Welcom, W, E, L, C, O, M, and clicks Apply. <pause> For one and a half seconds, the page looks like this.

<!-- block fig-004 | src: "localhost 5173 promo code welcom apply checking figure" -->
This is the middle of the wait, figure four, in the browser at localhost five one seven three. <pause> There's the Promo code heading, the box holding Welcom, and the Apply button. Both the box and the button are disabled. <breath> And under them, the line Checking... is showing.

<!-- block p-052 | src: "then the server answers and the page looks" -->
Then the server answers... and the page looks like this.

<!-- block fig-005 | src: "localhost 5173 promo code welcom apply this code" -->
Then the answer comes back. Figure five is the same page, after the server has refused Welcom. <pause> The box and Apply work again. <breath> And below the form, in red, the error line: This code is not valid.

<!-- block p-053 | src: "here is what happened in order" -->
Here's what happened, in order.

<!-- block list-010 | src: "the shopper clicked apply and the browser called" -->
One. The shopper clicked Apply, and the browser called handle submit. <pause> Two. The handler turned off the box and the button. Then it took hidden off the Checking... line. <breath> Three. At await, the handler paused for one and a half seconds. Then the fake server said no. <pause> Four. JavaScript jumped into catch, which took hidden off the error line. <breath> And five. Finally hid the Checking... line again. Then it turned the box and the button on again.

<!-- block p-054 | src: "so far everything works the shopper sees the" -->
So far, everything works. <pause> The shopper sees the typo, and adds the missing E.

<!-- block h3-012 | src: "the second try welcome is accepted and both" -->
<pause> The second try. Welcome is accepted... and both lines show.

<!-- block p-055 | src: "the box now holds welcome and the shopper" -->
The box now holds Welcome, and the shopper clicks Apply again. <breath> During the wait, the old error line is still on the page... right under the Checking... line.

<!-- block fig-006 | src: "localhost 5173 promo code welcome apply checking this" -->
Look closely at figure four's twin here, figure six. <pause> It's the second try, and the server is still checking Welcome. <breath> The Checking... line is there, and right below it, the old error line, This code is not valid. <pause> Both on screen together.

<!-- block p-056 | src: "after 1 5 seconds the page looks like" -->
After one and a half seconds, the page looks like this.

<!-- block fig-007 | src: "localhost 5173 this code is not valid code" -->
And figure seven is the end of the story. <pause> The form is gone. <breath> What's left on the page is the old error line, This code is not valid... and under it, Code applied! You get free delivery. <pause> Both lines, at once.

<!-- block p-057 | src: "the shop says the code is not valid" -->
The shop says the code is not valid... and it also says the code was applied. <sigh> The Console shows nothing, because no line of code failed. <pause> Here's what happened, in order.

<!-- block list-011 | src: "the shopper clicked apply and the browser called" -->
Step one. The shopper clicked Apply, and the browser called handle submit again. <pause> Step two. The handler turned off the box and the button, and showed Checking... <breath> Step three. Nothing in the handler touched the error line, so it was still showing. <pause> Step four. At await, the handler paused. Then the fake server said yes. <breath> Step five. Inside try, the next line took hidden off the success line. <pause> Step six. The line after it put hidden on the whole form. <breath> Step seven. Finally hid Checking..., and turned the box and the button on. All three are inside the hidden form, so the shopper sees none of them. <pause> And step eight. No line anywhere put hidden back on the error line. <pause> So the error line stayed.

<!-- block p-058 | src: "look at step 6 the code that runs" -->
Look at step six. <pause> The code that runs after a yes never thinks about the error line. <breath> The developer tested the yes on a fresh page... where the error line had never been shown.

<!-- part -->

<!-- block h3-013 | src: "mistake forgetting to hide one element" -->
<pause> The mistake. Forgetting to hide one element.

<!-- block p-059 | src: "this bug is easy to write and easy" -->
This bug is easy to write, and easy to miss. <pause> Here's how it usually goes.

<!-- block list-012 | src: "the developer writes the handler and tests a" -->
The developer writes the handler, and tests a wrong code. The error line appears. It works. <pause> Then the developer reloads the page, and tests a right code. The success line appears. It works. <breath> But a real shopper tries a wrong code first, then a right code... exactly like ours. <pause> Both lines are on screen.

<!-- block p-060 | src: "the fix is one more command in the" -->
The fix is one more command, in the try part.

<!-- block code-011 | src: "src plain promo js 19 try 20 await" -->
Back in plain promo dot js, lines nineteen to twenty-four. <pause> The try block is the same, with one line added. <breath> Right after the await, line twenty-one is new. Error text dot class list dot add, hidden. Its note says, new, hide the error line from an earlier try. <pause> Then the success line shows, and the form hides, just as before.

<!-- block p-061 | src: "that fixes today s bug but the real" -->
That fixes today's bug. <pause> But the real problem is still there. Every handler must remember every element. <breath> Say that next month, the shop adds a Remove code button. Now the developer must go through every handler again. <pause> And for every element, they must ask... should it be shown, or hidden, after this change?

<!-- block p-062 | src: "the react docs say it plainly imperative code" -->
The React docs say it plainly. <pause> Imperative code for a page, quote, gets exponentially more difficult to manage in more complex systems. <breath> Adding a new element or a new interaction, quote, would require carefully checking all existing code to make sure you haven't introduced a bug.

<!-- block fig-008 | src: "the plain handler after a second successful try" -->
Figure eight puts the whole bug in one small diagram. <pause> At the root, the plain handler, after a second, successful try. It splits into two branches. <breath> The first branch is what the developer remembered. Show the success line, hide the form, hide Checking... <pause> The second branch is what the developer forgot. Hide the error line from the first try. <breath> And its arrow leads to the result... no line of code does it, so both lines stay on screen.

<!-- block p-063 | src: "in react we never write commands like these" -->
In React, we never write commands like these. <pause> Instead, we say how the page looks in each case... and React changes the page. <breath> The next four principles build the promo code box that way, one step at a time.

<!-- block box-002 | src: "principle 1 imperative code one forgotten command breaks" -->
<pause> And that brings us to principle one, in a single card. Imperative code... one forgotten command breaks the page. <breath> Describe each look of the page once, and let the handler change only state, instead of commanding every element in every handler. <pause> This one bites every developer who writes forms by hand. <breath> Your error line works. Your success line works. Then a real user tries a wrong code, and then a right one... and both lines sit on the screen together. <pause> You see, each handler only shows or hides what you remembered to write in it, and nothing checks the rest of the page. <breath> In React, the handler changes one value. The JSX already says what the page looks like for that value... so a line from an old look cannot stay behind. <pause> The do this example has three short lines. A const with done and set done, from use state, starting at false. A button with disabled equals done, whose click calls set done with true. Its note says, the handler changes one value. And then done, the double ampersand, Thanks! <breath> The do not do this example is the plain one. A click listener on the button, setting button dot disabled to true, and taking hidden off the thanks line. <pause> Its note says, wrong. Every element needs its own command... and a forgotten one stays wrong.

<!-- block h2-003 | src: "section 2 principle 2 list every look first" -->
<pause> Section two. Principle two. <pause> List every look first.

<!-- block h3-014 | src: "one prop that picks the look" -->
One prop... that picks the look.

<!-- block p-064 | src: "before we write any logic for the promo" -->
Before we write any logic for the promo code box, let's look at a much smaller component. <pause> It just shows whether a light is on... or off.

<!-- block code-012 | src: "light jsx 1 export default function light status" -->
Here, Light dot jsx. Three lines. <pause> Line one exports a function called Light, and it unpacks one prop, status, with a default of off. The note there says it plainly: no status from the parent? Use off. <breath> Line two does the real work. If status is on, it returns a paragraph that says Light is on... otherwise, a paragraph that says Light is off. <pause> And line three just closes the function.

<!-- block p-065 | src: "the parent renders light and passes nothing so" -->
The parent renders Light, and passes nothing. <pause> So the default value from Lesson nine gives status the value off. <breath> The ternary from Lesson ten checks whether status is on. It is not... so the page shows the second paragraph.

<!-- block fig-009 | src: "localhost 5173 light is off figure 9 the" -->
That's what figure nine shows. A browser at localhost five one seven three, and one line on the page: Light is off. <pause> The parent passed no status, so status is off.

<!-- block p-066 | src: "now change one word the default from off" -->
Now change one word. <pause> The default, from off to on... and save the file.

<!-- block fig-010 | src: "localhost 5173 light is on figure 10 the" -->
And in figure ten, the same browser, the same Light component... but now the page says Light is on. <pause> Only the default changed.

<!-- block p-067 | src: "here is what happened in order" -->
Here is what happened, in order.

<!-- block list-013 | src: "the parent still passes nothing so the default" -->
First, the parent still passes nothing, so the default gives status the value on. <pause> Then the ternary checks whether status is on. <breath> It is, so the function returns the first paragraph. <pause> And last, React puts that paragraph on the page.

<!-- block p-068 | src: "we changed no logic at all one value" -->
We changed no logic at all. <pause> One value picked the look. <breath> And the name status is our own choice. The React docs say about this prop... you could call that prop anything you like, the naming is not important.

<!-- block h3-015 | src: "drawing every look before any logic" -->
Drawing every look... before any logic.

<!-- block p-069 | src: "designers work this way before anyone writes code" -->
Designers work this way. <pause> Before anyone writes code, a designer draws one picture for every screen the user can see. <breath> There's a picture of the empty form, one of the form while it is sending, one of the form with an error... and so on. <pause> Such a picture is called a mock.

<!-- block p-070 | src: "the react docs ask us to do the" -->
The React docs ask us to do the same in code. <pause> In their words: just like a designer, you'll want to mock up, or create mocks, for the different states before you add logic. <breath> In code, a mock is a version of the component with no logic. It only draws a look.

<!-- block p-071 | src: "each look has a name in react one" -->
Each look has a name in React. <pause> One look of the component that the user can see is called a visual state. <breath> So the light has two visual states... on, and off.

<!-- block p-072 | src: "our promo code box has five visual states" -->
Our promo code box has five visual states.

<!-- block list-014 | src: "empty the box is empty and apply is" -->
Five looks, then. <pause> Empty: the box is empty, and Apply is off. <pause> Typing: the box has text, and Apply works. <breath> Checking: the box and Apply are both off, and the word Checking is shown. <pause> Error: the same as typing, plus the red line, This code is not valid. <breath> And success: the form is gone, and instead the page shows, Code applied! You get free delivery.

<!-- block p-073 | src: "error and typing show the same form the" -->
Error and typing show the same form. The only difference is one red line. <pause> Still, they are two looks... because the user sees the difference.

<!-- block fig-011 | src: "the five looks of the promo code box" -->
Figure eleven puts all of that in one picture. At the top, a title: the five looks of the promo code box. <pause> Below it, five branches, one for each look. Empty, with the box empty and Apply off. Typing, with text in the box and Apply working. <breath> Checking, with the box and Apply off and Checking shown. Error, like typing, plus the red line. And success, where the form is gone and the free delivery line takes its place. <pause> All five are listed before we write any logic.

<!-- part -->

<!-- block h3-016 | src: "a mock of the promo code box" -->
A mock of the promo code box.

<!-- block p-074 | src: "now we write the promo code component as" -->
Now we write the promo code component as a mock. <pause> It has no state, and no handler yet. <breath> It only draws each look from one prop, status, whose default is empty. The first lines handle the success look.

<!-- block code-013 | src: "src components promocode jsx 1 export default function" -->
Over to the components folder, and PromoCode dot jsx. <pause> Line one: the function takes status, and the note says it's the look to draw, empty by default. <breath> Line two asks, is status success? If it is, line three returns just one paragraph... Code applied! You get free delivery. That's an early return, so only this line comes back, no form at all. <pause> Line four closes the if.

<!-- block p-075 | src: "the rest of the function draws the form" -->
The rest of the function draws the form, for the other four looks.

<!-- block code-014 | src: "src components promocode jsx 5 return 6 form" -->
Same file, picking up at line five, where the return starts. <pause> Line six opens a form, and line seven is a heading, Promo code. <breath> Line eight is the input. Its disabled is set to status equals checking, in curly braces... so the box is off only while checking. <pause> Line nine is the Apply button, and its disabled says status is empty, or status is checking. So the button is off when empty, or when checking. <breath> Lines ten and eleven are the two extra lines. Line ten shows Checking... only when status is checking, with the double ampersand. Line eleven shows the red paragraph, This code is not valid, only when status is error. <pause> And the last lines close the form and the function.

<!-- block p-076 | src: "the button s condition uses two vertical bars" -->
The button's condition uses two vertical bars. <pause> In JavaScript, that means or. <breath> The whole condition is true when the left side is true, or the right side is true... or both. So the button is off in the empty look, and in the checking look.

<!-- block p-077 | src: "the main file renders one promo code box" -->
The main file renders one promo code box, and passes no status.

<!-- block code-015 | src: "src app jsx 1 import promocode from components" -->
What does App look like? Very short. <pause> Line one imports PromoCode from the components folder. <breath> Then line three starts the App function, and line four returns a single PromoCode tag, with nothing on it. The note says why that matters: no status, so the box draws its empty look.

<!-- block p-078 | src: "the page shows the empty look" -->
The page shows the empty look.

<!-- block fig-012 | src: "localhost 5173 promo code apply figure 12 the" -->
The browser, in figure twelve, shows the heading Promo code, an empty box, and an Apply button that's turned off. <pause> App gave no status, so the mock drew the empty look.

<!-- block p-079 | src: "here is what happened in order" -->
And again, here is what happened, in order.

<!-- block list-015 | src: "app renders promocode and passes no status the" -->
To start, App renders PromoCode and passes no status. <pause> The default value gives status the value empty. <breath> Next, status equals success is false, so the function skips the early return and goes on to the form. <pause> Status equals checking is false too, so the box gets disabled equals false, and it works. <breath> But status equals empty is true, so the button gets disabled equals true... and it's off. <pause> Finally, neither line under the button matches, so React draws neither of them.

<!-- block p-080 | src: "now change the default from empty to success" -->
Now change the default from empty to success, and save. <pause> The page shows only the success line.

<!-- block fig-013 | src: "localhost 5173 code applied you get free delivery" -->
Almost nothing on this one, figure thirteen. Just one sentence: Code applied! You get free delivery. <pause> Same mock, with the default changed to success.

<!-- block p-081 | src: "this time status success is true so the" -->
This time, status equals success is true. <pause> So the early return gives only the paragraph, and the function never reaches the form. <breath> There's no form on the page at all... not even a hidden one.

<!-- block h3-017 | src: "every look on one page" -->
Every look, on one page.

<!-- block p-082 | src: "changing the default by hand shows one look" -->
Changing the default by hand shows one look at a time. <pause> We can do better, and show all five looks at once. <breath> App keeps a list of every status, and draws one promo code box for each.

<!-- block code-016 | src: "src app jsx 1 import promocode from components" -->
So App changes. <pause> The import on line one stays the same. Line three is new: a constant called statuses, an array with the five names, empty, typing, checking, error, and success. <breath> Inside the return, line seven opens an empty fragment, and line eight maps over statuses. The note says, one section for each look. <pause> Line nine is that section, with the status as its key. Line ten puts the status in a small h4 title. <breath> And line eleven is the PromoCode tag, with status equals status, in curly braces. This box draws this look. <pause> The rest just closes everything up.

<!-- block p-083 | src: "statuses is our own array of the five" -->
Statuses is our own array of the five names. <pause> The map from Lesson eighteen walks it one item at a time. For each name, it draws a section. <breath> The section has the name as a small title, and a promo code box that receives that name as its status. <pause> Each name is different, so it also works as the key.

<!-- block p-084 | src: "the page shows all five looks one under" -->
The page shows all five looks, one under the other.

<!-- block fig-014 | src: "localhost 5173 empty promo code apply typing promo" -->
Look down figure fourteen, from the top. <pause> Under empty, the form with Apply off. Under typing, the same form, and Apply works. <breath> Under checking, the box and Apply are both off, with Checking under them. Under error, the form with the red line, This code is not valid. <pause> And under success, no form at all, just Code applied! You get free delivery. <breath> Notice the box is empty in every section, because the mock gives it no text yet.

<!-- block p-085 | src: "the box is empty in every section even" -->
The box is empty in every section... even under typing. <pause> That's fine. The mock gives the box no text, because text comes from the user, and there is no user yet. <breath> What we check here is the rest of each look. Which control is off, and which line is shown.

<!-- block p-086 | src: "a page like this has a name the" -->
A page like this has a name. <pause> The React docs say it's often called a living styleguide, or a storybook. <breath> You can see every look at a glance. You can also change the design of one look without clicking through the whole form. <pause> As the docs put it, mocking lets you quickly iterate on the UI... before you wire up any logic.

<!-- part -->

<!-- block h3-018 | src: "mistake leaving out the checking look" -->
<pause> Now, a mistake. Leaving out the checking look.

<!-- block p-087 | src: "listing the looks on paper sounds slow many" -->
Listing the looks on paper sounds slow. <pause> Many developers skip it, and start with the looks they can think of. An empty box, a typed box, and a done message. <breath> Here is the mock they write.

<!-- block code-017 | src: "src components promocode jsx 5 return 6 form" -->
Compare this with our form a moment ago. <pause> Line eight is a plain input... nothing turns it off. <breath> And on line nine, the button is disabled only when status is empty. The note on that line is marked wrong: there's no checking look, so Apply stays on while the server checks.

<!-- block p-088 | src: "later when the handler is connected this page" -->
Later, when the handler is connected, this page works fine for a calm shopper. <pause> But here's what happens to an impatient one.

<!-- block list-016 | src: "the shopper types welcome and clicks apply there" -->
The shopper types Welcome, and clicks Apply. <pause> There's no checking look, so nothing turns the box or Apply off. <breath> The server needs one and a half seconds. The shopper sees no change... and clicks Apply again. <pause> So the form is sent a second time, and the code goes to the server twice. <sigh>

<!-- block p-089 | src: "writing the list of looks first shows the" -->
Writing the list of looks first shows the gap. <pause> Between typing and success, the shopper waits. <breath> The React docs list this waiting look on its own: Submitting. Form is completely disabled. Spinner is shown. <pause> Their page on batching also notes that if the first button click disables a form, the second click would not submit it again. <breath> Once the checking look is on the list, the mock has to say what it looks like. <pause> That's why our mock turns off the box and Apply when status is checking.

<!-- block fig-015 | src: "which looks did the developer list three looks" -->
Which looks did the developer list? That's the question figure fifteen asks, with two sides. <pause> On one side, three looks: empty, typing, success. There's no look for the wait, so Apply stays on while the server checks, and a second click sends the code twice. <breath> On the other side, five looks: empty, typing, checking, error, success. The wait is its own look, the box and Apply are off while checking... and a second click does nothing.

<!-- block p-090 | src: "computer science has a name for something that" -->
Computer science has a name for something that is always in exactly one of a few states, like our box with its five looks. <pause> It's called a state machine. You'll hear the name in interviews. <breath> The React docs say React stands at the intersection of design and computer science. <pause> And this method takes one idea from each side. The designer's list of looks... and the state machine.

<!-- block box-003 | src: "principle 2 visual states list every look before" -->
<pause> So, that's principle two. Visual states. List every look, before any logic. <breath> Write down every look the user can see, then draw each one from a single status prop, before adding state or handlers. <pause> It's so tempting to jump straight into handlers. But the look you forget to list is exactly the look you forget to build... and the waiting look is the one everybody forgets. <breath> Then the button stays on while the server thinks, and the impatient user clicks twice. <pause> With a status prop and a default value, you can switch the whole component between its looks by changing one word. And with map, you can see every look on one page. <breath> The good version takes status with a default of empty, because one prop picks the look. If status is success, it returns the free delivery line. Otherwise, it returns Apply, turned off when status is empty, or checking. <pause> The version to avoid turns Apply off only when status is empty. There's no checking look... so Apply stays on while the server checks.

<!-- block h2-004 | src: "section 3 principle 3 find every trigger" -->
<pause> Section three. <pause> Principle three. <breath> Find every trigger.

<!-- block h3-019 | src: "a button that changes back on its own" -->
A button that changes back... on its own.

<!-- block p-091 | src: "so far our looks change only when we" -->
So far, our looks change only when we edit the code. <pause> But on a real page, something has to move the component from one look to the next. <breath> Here is a small example, with two kinds of movement.

<!-- block p-092 | src: "a copy link button shows copied for a" -->
A Copy link button shows Copied! for a moment after a click. <pause> Then it goes back to Copy link. <breath> We leave out the copying itself here... because only the label matters.

<!-- block code-018 | src: "copybutton jsx 1 import usestate from react 2" -->
A brand new component now. Copy Button dot jsx, and the whole thing fits in twelve lines. <pause> Line one imports use state from React. <breath> On line four, we keep one piece of state called status, with its setter, set status. It starts as ready. <pause> Then comes the click handler, handle click. Line seven calls set status with copied... and the note on that line says it's moved by the user's click. <breath> Line eight is the interesting one. It calls set timeout, with a small function that sets status back to ready, after fifteen hundred milliseconds. The note says, moved by a timer, one and a half seconds later. <pause> And line eleven returns the button. Its on click is handle click, and its label checks status. If status is copied, it shows Copied! Otherwise... Copy link.

<!-- block p-093 | src: "when the page opens status is ready so" -->
When the page opens, status is ready... so the button says Copy link.

<!-- block fig-016 | src: "localhost 5173 copy link figure 16 the copy" -->
Over in the browser, figure sixteen. A browser window at localhost five one seven three, and one button in it, reading Copy link. <pause> This is the page right when it opens.

<!-- block p-094 | src: "the user clicks it once" -->
<breath> Now the user clicks it, once.

<!-- block fig-017 | src: "localhost 5173 copied figure 17 the same button" -->
Same window, same button, right after the click. <pause> The label now says Copied! That's figure seventeen.

<!-- block p-095 | src: "then the user does nothing at all 1" -->
Then the user does nothing at all. <pause> And one and a half seconds later... the button changes back.

<!-- block fig-018 | src: "localhost 5173 copy link figure 18 the same" -->
Wait a moment, and the button reads Copy link again. That's figure eighteen. <pause> Nobody clicked a second time. One and a half seconds just passed, and it went back by itself.

<!-- block p-096 | src: "here is what happened in order" -->
<breath> So here is what happened, in order.

<!-- block list-017 | src: "the user clicked and react called handleclick calling" -->
Everything begins with the user's click, and React calls handle click. <pause> Calling set status with copied asks for the copied look. <breath> Then set timeout, from Lesson fifteen, asks the browser to run a small function after fifteen hundred milliseconds. <pause> The handler finishes, and React draws the button with the label Copied! <breath> One and a half seconds later, the timer ends... and the browser runs that small function. It calls set status with ready. <pause> And React draws the button again, with the label Copy link.

<!-- block p-097 | src: "two different things moved this button the first" -->
So, two different things moved this button. <pause> The first was the user's click. The second was a timer... and nobody touched anything for it. <breath> The React docs give these two kinds of trigger names.

<!-- block list-018 | src: "a human input is something the user does" -->
So there are two kinds. A human input is something the user does. Clicking a button, typing in a box, following a link. <pause> The docs note that human inputs often require event handlers. <breath> And a computer input is something that happens without the user. A network answer arriving, a timer ending... an image finishing loading.

<!-- block p-098 | src: "the docs draw a finger for human inputs" -->
The docs draw a finger for human inputs, and a row of ones and zeroes for computer inputs. <pause> Then they add the rule that matters most. <breath> In both cases, you must set state variables to update the UI.

<!-- part -->

<!-- block h3-020 | src: "the triggers of the promo code box" -->
<pause> Now, the triggers of our promo code box.

<!-- block p-099 | src: "now we list what moves our promo code" -->
Let's list what moves our promo code box. <pause> Each row names the look before, the trigger, who causes it... and the look after.

<!-- block table-002 | src: "from trigger kind to empty the shopper types" -->
What moves the box, then? Let's go row by row. <pause> From empty, the shopper types a letter. That's a human, and the box goes to typing. <breath> From typing, the shopper clears the box, also human, and we're back to empty. <pause> Still in typing, the shopper clicks Apply. Human again, and the box goes to checking. <breath> Now from checking, two rows. The server accepts the code, that's the computer, and we go to success. Or the server refuses the code, the computer again, and we go to error. <pause> And last, from error, the shopper fixes the code and clicks Apply. A human... and we're back in checking.

<!-- block p-100 | src: "the react docs suggest drawing this table as" -->
The React docs suggest drawing this table as a picture. <pause> Each look is a circle with a label. Each change is an arrow, with its trigger written on it. <breath> A drawing like that lets you sort out bugs long before implementation. <pause> Here are the arrows of our box, from left to right.

<!-- block fig-019 | src: "how the promo code box moves between its" -->
Figure nineteen draws it out. The title says, how the promo code box moves between its looks. <pause> The first arrow leaves empty, labelled start typing, human, and goes to typing. <breath> From typing, press Apply, human, goes to checking. <pause> Checking has two arrows. Server accepts, computer, goes to success. Server refuses, computer, goes to error. <breath> And from error, press Apply, human, goes back to checking again.

<!-- block p-101 | src: "look at the checking look it has two" -->
Look at the checking look. <pause> It has two arrows out... one for yes, and one for no. <breath> Every look needs at least one way out, except the last one. <pause> A look with no way out is a dead end, and the user is stuck there.

<!-- block h3-021 | src: "how the server s answer sets state" -->
<pause> How the server's answer sets state.

<!-- block p-102 | src: "our mock still gets status from a prop" -->
Our mock still gets status from a prop. <pause> In Principle four, we will move status into state, with the setter, set status. <breath> We will also keep the text of the box in state, as code. <pause> For now, just picture that both are already there.

<!-- block p-103 | src: "here is a first look at the handler" -->
Here is a first look at the handler that Apply will run. <breath> It uses the same four JavaScript words as the plain handler of Principle one, from async to catch. <pause> But it only calls setters.

<!-- block code-019 | src: "src components promocode jsx 1 async function handlesubmit" -->
Notice what's missing, compared with the plain version. No element is touched at all. <pause> This is Promo Code dot jsx, in the components folder. Line one starts an async function, handle submit, that takes the event, e. <breath> Line two calls e dot prevent default. <pause> Line three calls set status with checking, and the note says, human input, the click. <breath> Then a try. Line five awaits check code, with our code. <pause> Line six sets status to success, and the note says, computer input, the server said yes. <breath> And in the catch, line eight sets status to error. Computer input again... the server said no.

<!-- block p-104 | src: "the click and the server s answer are" -->
The click and the server's answer are very different events. <pause> For React, though, they end the same way. <breath> Each one calls a setter, and each setter call asks React to draw the component again.

<!-- block p-105 | src: "there is one surprise here the last two" -->
There's one surprise here. <pause> The last two setter calls sit inside the click handler... but they do not run during the click. They run one and a half seconds later. <breath> To see why, we need one more fact about async functions. <pause> When an async function reaches await, it steps aside, and the browser goes on with other work. <pause> The rest of the function waits for the answer.

<!-- block p-106 | src: "here is what happens in order" -->
<breath> Let's go through it, in order.

<!-- block list-019 | src: "the shopper clicks apply and react calls handlesubmit" -->
The shopper clicks Apply, and React calls handle submit. <pause> Calling set status with checking asks for the checking look. <breath> The handler reaches await, and steps aside. <pause> The part of the handler that runs on the click is now over. <breath> As we saw with batching in Lesson sixteen, React handles state changes after the handler's code has run. So React now draws the checking look... while the rest of the handler is still waiting. <pause> One and a half seconds later, the server answers. Nobody clicked anything. <breath> On a yes, the handler goes on after await, and asks for the success look. On a no, it jumps into catch, and asks for the error look. <pause> And React draws the new look.

<!-- block p-107 | src: "so the code after await belongs to a" -->
So the code after await belongs to a computer input, not to the click. <pause> It runs when the answer arrives.

<!-- block p-108 | src: "one small trap follows from this after await" -->
One small trap follows from this. <pause> After await, the variable status inside the handler still holds the value from the render that created the handler. <breath> We saw this with state snapshots, in Lesson fifteen. <pause> So status does not say checking there... even though the page does. <breath> After waiting, never read status to decide what to do next. <pause> Call the setter for the next look directly, as the handler above does.

<!-- block h3-022 | src: "mistake planning only for the server s yes" -->
<pause> A mistake. <pause> Planning only for the server's yes.

<!-- block p-109 | src: "a developer who thinks only of the happy" -->
Say we think only of the happy path. <pause> Then we write the handler without try and catch.

<!-- block code-020 | src: "src components promocode jsx 1 async function handlesubmit" -->
The handler again, and shorter now. <pause> Prevent default on line two, then set status with checking on line three. <breath> Line four awaits check code with our code, and this is the line marked wrong. <pause> The note says, a no from the server stops the handler here... and nothing sets the next look. <breath> Line five, set status with success, only ever runs on a yes.

<!-- block p-110 | src: "the shopper types welcom and clicks apply 1" -->
The shopper types Welcom, with the E missing, and clicks Apply. <pause> One and a half seconds later, the page is still waiting. <breath> And it waits... forever.

<!-- block fig-020 | src: "localhost 5173 promo code welcom apply checking console" -->
<sigh> And there it is, stuck, in figure twenty. The promo code box still holds Welcom, and under it, Checking... <pause> The box and the Apply button are both disabled. <breath> Below the page, the Console shows a red error. Uncaught, in promise. Error, this code is not valid. <pause> That's the page after the server refuses Welcom, with no catch in the handler.

<!-- block p-111 | src: "here is what happened in order" -->
So what went wrong? Step by step.

<!-- block list-020 | src: "the click asked for the checking look and" -->
The click asked for the checking look, and React drew it. The box and Apply turned off. <pause> Then the server said no, so the promise failed at await. <breath> There was no catch to jump to. So the handler stopped at that line... and the line that asks for the success look never ran. <pause> Nothing called a setter, so React never drew another look. The page stays on checking, with the box and Apply off. <breath> And because nothing caught the failed promise, the browser reports it in the Console, as an error.

<!-- block p-112 | src: "the shopper cannot even fix the typo because" -->
The shopper cannot even fix the typo... because the box is off. <pause> The arrow drawing shows the gap at once. <breath> The checking look has two arrows out, but this handler builds only one of them. <pause> Adding try and catch builds the second arrow, as in the handler of the previous section.

<!-- block box-004 | src: "principle 3 triggers human inputs and computer inputs" -->
<pause> Time for the card of principle three. <pause> Triggers, human inputs and computer inputs, both set state. <breath> List every trigger that moves the component, both what the user does and what the computer does... and make each one call a setter. <pause> We think of clicks and typing first, because we do them ourselves. <breath> But the server's answer moves the page too. And a server can say no. <pause> If your handler only plans for yes, the first wrong code leaves the page stuck on Checking... <pause> The box stays off, so the user cannot even fix the typo. <breath> Draw each look as a circle, and each trigger as an arrow, and make sure every look except the last has a way out. <pause> The card shows both versions. The one to do wraps the await of check code and set status with success in a try. Then a catch, marked as the second way out of checking, sets status to error. <breath> The one not to do just sets checking, awaits check code, and sets success. <pause> A refused code stops it right there... and the page stays on checking forever.

<!-- part -->

<!-- block h2-005 | src: "section 4 principle 4 one status instead of" -->
<pause> Section four. Principle four. <pause> One status... instead of many switches.

<!-- block h3-023 | src: "two switches four combinations" -->
Two switches... and four combinations.

<!-- block p-113 | src: "our mock picks its look with one prop" -->
Our mock picks its look with one prop, called status. <pause> But now the looks have to change while the page runs... so the look has to move into state. <breath> Many developers first reach for true or false values, one for each look. A true or false value is also called a boolean. <pause> Here's the smallest case, with two of them.

<!-- block code-021 | src: "two true or false values for two looks" -->
Two lines, two switches. <pause> Line one calls use state with false, and gets back is checking, along with its setter, set is checking. <breath> Line two does the same for is success, and it starts out false too. One true or false value for each look.

<!-- block p-114 | src: "each value can be true or false so" -->
Each value can be true, or false. <pause> So together... they can be in four combinations.

<!-- block table-003 | src: "ischecking issuccess what the page shows false false" -->
Let's walk through all four, one row at a time. <pause> Both false? That's the typing look. <pause> Is checking true, is success false... that's the checking look. <pause> Is checking false, is success true... the success look. <breath> And then the last row. Both true. Still checking... and already accepted. <pause> Nobody designed this look.

<!-- block p-115 | src: "only three of the four combinations are real" -->
So only three of the four combinations are real looks. <pause> The last one matches no look that anyone designed. A combination like that is called an impossible state... and the React docs call it a paradox. <breath> Nothing in JavaScript, or in React, stops our code from reaching it. React accepts any values in state... <pause> and it prints no warning.

<!-- block p-116 | src: "now compare that with one value that can" -->
Now compare that with one value... that can hold one of three strings.

<!-- block code-022 | src: "one status value for three looks 1 const" -->
Here, there's just one line. <pause> Use state starts status at the string typing, and set status is how we change it. <breath> The note beside it lists the three strings status may hold: typing, checking, or success.

<!-- block p-117 | src: "status holds exactly one string at a time" -->
Status holds exactly one string at a time. <pause> So it can be in exactly three looks, one for each string. <breath> The fourth combination... cannot even be written down.

<!-- block p-118 | src: "think of a traffic light it has three" -->
Think of a traffic light. <pause> It has three lamps, but only one of them is lit at a time. <breath> Now picture a light with three separate switches, one for each lamp. Someone could turn on red and green together... and the drivers would not know what to do. <pause> One status is the traffic light. Many true or false values... are the three separate switches.

<!-- block h3-024 | src: "four switches give sixteen combinations" -->
<pause> Four switches give sixteen combinations.

<!-- block p-119 | src: "the problem grows fast here is the count" -->
And the problem grows fast. <pause> Here's the count for our promo code box, step by step.

<!-- block list-021 | src: "one true or false value has 2 possible" -->
Take one true or false value. It has two possible values. <pause> Each extra true or false value doubles the number of combinations. <breath> Our box would need four of them... one each for typing, checking, success, and error. That gives two, times two, times two, times two... which is sixteen combinations. <pause> Only four of them are real looks. The other twelve are impossible states. <breath> And one status string, with four allowed values? That gives exactly four combinations, one for each look.

<!-- block p-120 | src: "the react docs put the goal like this" -->
The React docs put the goal like this. <pause> Each piece of state is a moving piece, and you want as few moving pieces as possible. <pause> More complexity leads to more bugs!

<!-- block h3-025 | src: "mistake an error line on a box that" -->
<pause> Now, a mistake. <pause> An error line, on a box that is still off.

<!-- block p-121 | src: "here is how an impossible state reaches a" -->
Here's how an impossible state reaches a real page. <breath> The developer keeps a separate true or false value for checking, for the error, and for success.

<!-- block code-023 | src: "src components promocode jsx 5 const code setcode" -->
Four lines of state, in PromoCode dot jsx, inside the components folder. <pause> Line five is code, the text in the box, and it starts as an empty string. <breath> Then come three switches, all starting at false: is checking on line six, is error on line seven, and is success on line eight.

<!-- block p-122 | src: "the handler turns checking on at the click" -->
The handler turns checking on at the click. <pause> And it turns the error on when the server says no.

<!-- block code-024 | src: "src components promocode jsx 10 async function handlesubmit" -->
Now look at line ten. That's the handler, handle submit, an async function that gets the event, e. <pause> Line eleven calls e dot prevent default. Line twelve sets is checking to true. <breath> Then comes a try. Line fourteen waits for check code with our code... and if the server accepts it, line fifteen sets is success to true. <pause> If it refuses, we land in the catch, and line seventeen sets is error to true. <pause> And the note on that line is marked wrong: is checking stays true... so the box stays off.

<!-- block p-123 | src: "the form reads each value on its own" -->
And the form reads each value on its own.

<!-- block code-025 | src: "src components promocode jsx 28 input value code" -->
So what does the markup do with them? <pause> Line twenty-eight is the input. Its value is code, its on change handler calls set code with e dot target dot value, and it's disabled while is checking is true. That's the note there: off while is checking is true. <breath> Line twenty-nine is the Apply button. It's disabled when code dot length is zero... or when is checking is true. <pause> Line thirty shows a paragraph that says Checking, but only if is checking is true, using the double ampersand. <pause> And line thirty-one does the same with is error. It shows a paragraph with the class name error, and the text, This code is not valid.

<!-- block p-124 | src: "the shopper types welcom and clicks apply after" -->
The shopper types Welcom... welcome with the last E missing, and clicks Apply. <pause> After the server's answer... the page looks like this.

<!-- block fig-021 | src: "localhost 5173 promo code welcom apply checking this" -->
Figure twenty-one, and something is off here. <pause> In the browser, under the heading Promo code, the box still holds Welcom, with Apply next to it. <breath> Under them, Checking... and right below that, the error line, This code is not valid. <pause> Both at once. Checking and error are two separate true or false values here, so they show together... and the box and Apply both stay disabled.

<!-- block p-125 | src: "here is what happened in order" -->
Here's what happened, in order.

<!-- block list-022 | src: "the click set ischecking to true and react" -->
First, the click set is checking to true, and React drew the checking look. <pause> The box and Apply turned off, and Checking appeared under them. <breath> Then the server said no, and JavaScript jumped into the catch. The catch set is error to true. <pause> But nothing set is checking back to false. <sigh> So now both values are true. <pause> And React draws exactly what the JSX says for that pair... the box off, Apply off, Checking, and the error line.

<!-- block p-126 | src: "the page tells the shopper to fix the" -->
So the page tells the shopper to fix the code... <pause> and at the same time, it does not let the shopper type. <breath> The React docs warn about exactly this case. They say: you never want to show an error message and disable the input at the same time, or the user won't be able to correct the error!

<!-- block p-127 | src: "with one status this combination cannot happen here" -->
With one status, this combination cannot happen. <pause> Here's the same moment, with status.

<!-- block list-023 | src: "the click sets status to checking the server" -->
This time, the click sets status to the string checking. <pause> The server says no, and the catch part sets status to the string error. <breath> The new string replaces the old one. So status now holds error, and nothing else. <pause> React draws the error look... and the box works again.

<!-- block p-128 | src: "we never have to remember to turn checking" -->
We never have to remember to turn checking off. <pause> Setting the next look turns the old one off, by itself.

<!-- part -->

<!-- block h3-026 | src: "three questions that remove extra state" -->
<pause> Three questions... that remove extra state.

<!-- block p-129 | src: "the react docs ask three questions about every" -->
The React docs ask three questions about every piece of state. <pause> Each yes means that piece of state can go. <breath> Here they are, asked about our promo code box.

<!-- block list-024 | src: "does this state cause a paradox ischecking and" -->
Question one. Does this state cause a paradox? <pause> Is checking and is error can both be true, as we just saw. So we merge all the looks into one status. <breath> The second question. Is the same information already in another state variable? An is empty value would repeat what the text of the box already says... so we do not store it. We compute it instead. Code dot length, triple equals, zero, is true exactly when the box is empty. <breath> And the third question. Can it come from the opposite of another state variable? <pause> The React docs show this on their own quiz form. That form keeps the error message in a state variable called error. An is error value would only say whether that message is there. So the docs drop is error, and write error is not equal to null, with an exclamation mark and two equals signs. <pause> As we saw in Lesson one, that exclamation mark with two equals signs means is not equal to. So it's true when there is an error message. <pause> And in our box? Status, triple equals, the string error, already says it.

<!-- block p-130 | src: "after the three questions our box needs only" -->
After the three questions, our box needs only two pieces of state.

<!-- block list-025 | src: "code the text in the box status the" -->
Just two items now. <pause> First, code... the text in the box. <pause> Second, status... the current look. It holds one of four strings: typing, checking, error, or success.

<!-- block p-131 | src: "the empty look has no string of its" -->
The empty look has no string of its own anymore. <pause> It's simply a typing look where code is empty. <breath> A piece of state that you cannot remove without breaking the component is called essential state. <pause> Code and status are both essential.

<!-- block p-132 | src: "you can still use true or false names" -->
You can still use true or false names in your code, when they help. <pause> Just compute them from status, instead of storing them. <breath> The React docs show this in a hotel feedback form.

<!-- block code-026 | src: "a true or false name computed from status" -->
One single line, and notice, there's no use state in it at all. <pause> We make a constant called is sending, and set it to status, triple equals, the string sending. <breath> The note says it plainly: true only while status is the string sending.

<!-- block p-133 | src: "the react docs build their own version of" -->
The React docs build their own version of a form like ours... a little differently. <pause> They keep the error message in a separate piece of state. Their status has three values: typing, submitting, and success. <breath> The docs note that this version can still hold an error message while status is success. <pause> Our box puts error inside status instead, so that pair cannot exist at all. Both designs are valid... and this lesson keeps error inside status.

<!-- block p-134 | src: "the react docs also say that your first" -->
The React docs also say that your first idea likely won't be the best... <pause> but that's okay. <breath> Starting with many true or false values, and then merging them, is a normal part of the work.

<!-- block h3-027 | src: "the promo code box with real state" -->
<pause> The promo code box... with real state.

<!-- block p-135 | src: "now the mock prop becomes state the component" -->
Now the mock prop becomes state. <pause> The component no longer receives status from its parent. It keeps code and status itself.

<!-- block code-027 | src: "src components promocode jsx 1 import usestate from" -->
PromoCode dot jsx once more, and the switches are gone. <pause> Line one imports use state from react. Line three starts the component, PromoCode, exported as the default, and it takes no props now. <breath> Line four is code, the text in the box, empty at the start. Line five is status, the current look, starting at typing. It can be typing, checking, error, or success. <pause> Then line seven. If status is the string success, line eight returns just a paragraph... Code applied! You get free delivery.

<!-- block p-136 | src: "the form now reads both pieces of state" -->
The form now reads both pieces of state.

<!-- block code-028 | src: "src components promocode jsx 11 return 12 form" -->
From line eleven on, the component returns the form. <pause> Line thirteen is the heading, Promo code. <breath> Line fourteen is the input. Its value is code, on change stores e dot target dot value with set code, and it's disabled when status is the string checking. The note calls it a controlled box. <pause> Line fifteen is the Apply button, off when code dot length is zero, or when status is checking. The note says just that: off when empty or checking. <breath> Line sixteen shows Checking only when status is checking. And line seventeen shows the error line, This code is not valid, only when status is error. <pause> Lines eighteen to twenty close the form and the component.

<!-- block p-137 | src: "the box is now a controlled box as" -->
So the box is now a controlled box, as in Lesson twenty. <pause> Value equals code, in curly braces, makes it show what code holds. On change stores every keystroke in code. <breath> And the button's condition no longer asks whether status is the string empty. <pause> It asks whether code is empty.

<!-- block p-138 | src: "app goes back to rendering one promo code" -->
App goes back to rendering one promo code box.

<!-- block code-029 | src: "src app jsx 1 import promocode from components" -->
And App dot jsx gets short again. <pause> Line one imports PromoCode from the components folder. Line three is the App function, and line four returns one PromoCode tag. <breath> Its note reads: one box, which now picks its own look from state.

<!-- block p-139 | src: "when the page opens it shows the empty" -->
When the page opens, it shows the empty look.

<!-- block fig-022 | src: "localhost 5173 promo code apply figure 22 the" -->
This is the page right after it opens, in figure twenty-two. <pause> The heading Promo code, an empty box, and the Apply button... and Apply is disabled.

<!-- block p-140 | src: "the shopper types welcom" -->
Then the shopper types Welcom.

<!-- block fig-023 | src: "localhost 5173 promo code welcom apply figure 23" -->
Now figure twenty-three. <pause> Same box, but now it holds Welcom... and Apply is enabled.

<!-- block p-141 | src: "here is what happened in order" -->
And here's what happened, in order.

<!-- block list-026 | src: "when the page opened code was an empty" -->
When the page opened, code was an empty string, and status was the string typing. <pause> Code dot length, triple equals, zero, was true... so React drew Apply turned off. <breath> Then the shopper typed W. React called on change, and set code stored the letter. React drew the component again. <pause> Now code dot length triple equals zero was false, and status triple equals checking was false too. So React turned Apply on. <breath> The same thing happened for each of the next five letters... until code held Welcom.

<!-- block p-142 | src: "the empty look and the typing look both" -->
The empty look and the typing look both come from the same status, the string typing. <pause> The only difference is code.

<!-- block p-143 | src: "the form has no submit handler yet so" -->
The form has no submit handler yet. <pause> So a click on Apply right now would only make the browser reload the page... because nothing calls prevent default on the event. <breath> Principle five connects the handler.

<!-- block box-005 | src: "principle 4 one status a single string cannot" -->
Principle four, then, in one card. <pause> One status. A single string cannot be in two looks at once. <breath> Keep the current look in one status string, and compute everything else from it, or from other state... instead of keeping several true or false values. <pause> Every true or false value doubles the number of combinations, and most of them are looks nobody designed. <breath> With two switches for checking and error, forget to set is checking back to false... and the error shows while the box stays off. The user cannot even fix the typo. <pause> One status holds exactly one string, so setting the next look turns the old one off, by itself. <breath> And if you want a true or false name, compute it: status, triple equals, the string checking. <pause> So, what to do. Make status with use state, starting at typing, and later call set status with error. That replaces checking, so the box works again. <pause> And what not to do. Two switches, is checking and is error, both starting false... then set is error to true. <pause> That's the wrong one. Is checking is still true, so the error shows on a box that is still off.

<!-- part -->

<!-- block h2-006 | src: "section 5 principle 5 handlers only set the" -->
<pause> Section five. Principle five. <pause> Handlers only set the next state.

<!-- block h3-028 | src: "computing a class instead of adding one" -->
Computing a class... instead of adding one.

<!-- block p-144 | src: "in plain javascript we changed the look of" -->
In plain JavaScript, we changed the look of an element by adding or removing a CSS class. <breath> Here is a small example. A picture should get a blue frame when the user clicks it. <pause> Our stylesheet has a class for that... picture, dash dash, active.

<!-- block p-145 | src: "the plain way finds the picture element by" -->
The plain way finds the picture element by its id, and keeps it in a variable called image. <pause> Then it adds the class on the click.

<!-- block code-030 | src: "picture js 1 image addeventlistener click 2 image" -->
Three short lines of plain JavaScript, in picture dot js. <pause> Line one tells image to listen for a click, with add event listener. <breath> Line two is the whole point. On the click, image dot class list dot add puts in the class picture, dash dash, active. <pause> And the note on that line says it plainly... a command. Put the blue frame on this element. <pause> Line three just closes it up.

<!-- block p-146 | src: "react does not ask us to command the" -->
React does not ask us to command the element. <pause> Instead, we compute the class name from state... on every render.

<!-- block code-031 | src: "picture jsx 1 import usestate from react 2" -->
And the React version? <pause> This is Picture dot jsx. Line one imports use state from react. <breath> Line four gives us a piece of state, is active, with its setter, set is active, and it starts as false. <pause> Then line six makes a variable, class name, holding the string picture. <breath> Lines seven and eight say... if is active is true, add a space and picture dash dash active to the end of it. The note there says exactly that: add the second class to the text when is active is true. <pause> And line eleven returns an image. Its class name is the one we just worked out, the class text computed above, as the note puts it. <breath> On click, it calls set is active with true. The source is park dot jpg, and the alt text is The new park.

<!-- block p-147 | src: "the sign comes from javascript used on a" -->
The sign plus equals comes from JavaScript. <pause> Used on a string, it adds text to the end of it. <breath> So when is active is true, the text grows to picture, space, picture dash dash active. <pause> And the space at the start of that second part... keeps the two class names apart.

<!-- block p-148 | src: "the user clicks the picture once the elements" -->
The user clicks the picture once. <pause> The Elements panel then shows both classes on the image.

<!-- block fig-024 | src: "elementsconsole img class picture picture active alt the" -->
Look at figure twenty-four. It's the Elements panel, after that one click. <pause> There's the image tag, and its class attribute holds both names, picture, and picture dash dash active. <breath> Its alt is The new park, and its source is park dot jpg. <pause> The note beside it says both classes were computed from is active. React wrote them both into the class attribute.

<!-- block p-149 | src: "here is what happened in order" -->
Here is what happened, in order.

<!-- block list-027 | src: "the user clicked and the handler set isactive" -->
One click, and the handler set is active to true. <pause> Then React drew Picture again. This time is active was true... so the class name became picture, space, picture dash dash active. <breath> And last, React compared the new class name with the old one, which was just picture. <pause> They differ, so React wrote the new class name into the image's class attribute.

<!-- block p-150 | src: "the handler never talks about classes it only" -->
The handler never talks about classes. <pause> It only says that the picture is now active. <breath> The React docs describe the rule like this: "in React you need to describe what you want to see rather than manipulate the UI elements". <pause> This is the taxi again. The handler names the address... and React drives.

<!-- block h3-029 | src: "connecting the handler to the form" -->
<pause> Now, connecting the handler to the form.

<!-- block p-151 | src: "now we finish the promo code box the" -->
Now we finish the promo code box. <pause> The handler from Principle three goes inside the component, below the success check. <breath> It also needs check code, so the file imports it from our fake server.

<!-- block code-032 | src: "src components promocode jsx 1 import usestate from" -->
Here's the top half of PromoCode dot jsx, in the components folder. <pause> Line one imports use state. Line two brings in check code, from check code dot js, one folder up. <breath> Inside the component, line five holds the code, starting as an empty string. Line six holds status, starting as the string typing. <pause> Lines eight to ten are the success check. If status is success, we return just one paragraph... Code applied! You get free delivery. <breath> And then, from line twelve, the handler. Handle submit is async, and it takes the event, e. <pause> Line thirteen calls prevent default on it. Line fourteen sets status to checking, and the note says, next look, checking. <breath> Then a try. Line sixteen awaits check code with our code. If that works, line seventeen sets status to success... next look, success. <pause> And if it fails, the catch sets status to error on line nineteen. Next look, error.

<!-- block p-152 | src: "the handler does nothing else to the page" -->
The handler does nothing else to the page. <pause> It does not turn the box off. It does not show Checking... It does not hide the error line. <breath> It only names the next look.

<!-- block p-153 | src: "the form gets the handler through onsubmit the" -->
The form gets the handler through on submit. <pause> The box also gets a class that is computed from status... so it has a red border in the error look.

<!-- block code-033 | src: "src components promocode jsx 23 return 24 form" -->
The rest of the same file is the part it returns. <pause> Line twenty-four opens the form, with on submit set to handle submit. The note says Apply sends the form, and React calls handle submit. <breath> Line twenty-five is the heading, Promo code. <pause> Then the input, from line twenty-six. Its class name is a ternary... if status is error, it's code box and code box dash dash error, otherwise just code box. The note says red border only in the error look. <breath> Its value is code. On change, it calls set code with the typed text, e dot target dot value. And it's disabled when status is checking. <pause> Line thirty-two is the button. It's disabled when the code is empty, or when status is checking. Its word is Apply. <breath> Then two short lines. Line thirty-five shows a Checking... paragraph, only when status is checking, with the double ampersand. And line thirty-six shows a paragraph with the class error, saying This code is not valid... only when status is error.

<!-- block p-154 | src: "the ternary on the box works like the" -->
The ternary on the box works like the one in Light. <pause> In the error look, the box gets two classes, code box, and code box dash dash error. <breath> In every other look... it gets only code box.

<!-- block p-155 | src: "the stylesheet holds the classes that both versions" -->
The stylesheet holds the classes that both versions of the page use.

<!-- block code-034 | src: "src index css 1 hidden display none 2" -->
Three rules, in index dot css. <pause> Hidden gets display, none. <pause> Error gets color, red. <breath> And code box dash dash error gets a border, two pixels, solid, red.

<!-- part -->

<!-- block h3-030 | src: "following the shopper through every look" -->
<pause> Let's follow the shopper... through every look.

<!-- block p-156 | src: "now we follow our shopper through the whole" -->
Now we follow our shopper through the whole story. <pause> The shopper has typed Welcom... that's welcome, missing its last E, and clicks Apply. <breath> For one and a half seconds, the page shows the checking look.

<!-- block fig-025 | src: "localhost 5173 promo code welcom apply checking figure" -->
Back to the browser, at localhost five one seven three, for figure twenty-five. <pause> Under the Promo code heading, the box still says Welcom, next to the Apply button... and below them, Checking... <breath> The box and Apply are both disabled while the server checks the code.

<!-- block p-157 | src: "the elements panel shows that react wrote disabled" -->
The Elements panel shows that React wrote disabled onto both controls.

<!-- block fig-026 | src: "elementsconsole form h2 promo code h2 input class" -->
Figure twenty-six shows the form the way the Elements panel sees it, during the checking look. <pause> There's the Promo code heading. Then the input, with the class code box, the value Welcom, and a disabled attribute. <breath> Then the Apply button, also with disabled. Both notes say the same thing: disabled because status is checking. <pause> And last, the Checking... paragraph.

<!-- block p-158 | src: "then the server says no" -->
Then the server says no.

<!-- block fig-027 | src: "localhost 5173 promo code welcom apply this code" -->
The server refuses Welcom, and figure twenty-seven shows what's left. <pause> The box now has a red border, and under it, in red, This code is not valid. <breath> And the box and Apply are enabled again.

<!-- block p-159 | src: "here is what happened in order" -->
<pause> Here is what happened, in order.

<!-- block list-028 | src: "the shopper clicked apply that sent the form" -->
Our shopper clicked Apply. <pause> That sent the form, so React called handle submit. <breath> Next, the call to prevent default stopped the page from reloading. Then the handler asked for the checking look. <pause> The handler stepped aside at await... and React drew the checking look. Disabled became true on the box and on Apply, and the Checking... paragraph appeared. <breath> One and a half seconds later, the server said no. JavaScript jumped into catch, which asked for the error look. <pause> After that, React drew the error look, and compared it with the checking look. Four things differ. <breath> Disabled is now false on both controls. The Checking... paragraph is gone. The error paragraph is new. And the box has the class code box dash dash error. <pause> So React changed exactly those four things.

<!-- block p-160 | src: "the shopper adds the missing e and clicks" -->
The shopper adds the missing E, and clicks Apply again. <pause> For one and a half seconds, the page shows the checking look once more.

<!-- block fig-028 | src: "localhost 5173 promo code welcome apply checking figure" -->
Same browser, same box, figure twenty-eight. The code now reads Welcome, and Checking... is back under it. <pause> But notice... the error line from the first try is gone.

<!-- block p-161 | src: "look at what is missing the error line" -->
Look at what is missing. <pause> The error line from the first try is gone... and no line of our code removed it. <breath> Here is why, in order.

<!-- block list-029 | src: "the handler asked for the checking look so" -->
Step by step, then. The handler asked for the checking look, so checking replaced error in state. <pause> React drew the component again. This time, the check, is status error, was false. <breath> So the double ampersand gave false, and the JSX had no error paragraph. Then React compared the new JSX with the last one. <pause> The last one had an error paragraph, and the new one does not. <pause> So React removed that paragraph from the page.

<!-- block p-162 | src: "then the server says yes" -->
Then the server says yes.

<!-- block fig-029 | src: "localhost 5173 code applied you get free delivery" -->
And here's the happy ending, in figure twenty-nine. <pause> The server accepted Welcome, and the page holds only one line... Code applied! You get free delivery.

<!-- block p-163 | src: "catch did not run this time the line" -->
Catch did not run this time. <pause> The line after await asked for the success look, and React drew the component again. <breath> This time, the early return gave only the success paragraph. <pause> So React removed the whole form... and put the paragraph in its place.

<!-- block p-164 | src: "remember the plain page of principle 1 which" -->
Remember the plain page of Principle one? It showed the error line and the success line together. <pause> That cannot happen here. <breath> The error line appears only when status is error. The success line appears only when status is success. <pause> One string cannot hold both values at once.

<!-- block fig-030 | src: "the second try after a refused code plain" -->
Side by side, in figure thirty, we have the two handlers, on the second try, after a refused code, while the error line from the first try is still on screen. <pause> On one side, the plain handler. It must remember to hide the error line... it forgot, so both lines show. <breath> On the other side, the React handler. It only calls set status. The JSX for checking and success has no error line, so React removes it.

<!-- part -->

<!-- block h3-031 | src: "what react does under the hood" -->
<pause> What React does... under the hood.

<!-- block p-165 | src: "the react docs have a challenge that writes" -->
The React docs have a challenge that writes this kind of page in plain JavaScript, in a better way. <pause> It does not give a command for each change. <breath> Instead, it keeps the look in variables, and it has one function, update DOM. That function sets every element from those variables... every time anything changes. <pause> The docs say this function "shows what React does under the hood when you set the state".

<!-- block p-166 | src: "there is one difference and it matters for" -->
There is one difference, and it matters for the next mistake. <pause> Update DOM writes every property of every element, on every change. React does not. <breath> In the words of the docs, React "also avoids touching the DOM for properties that have not changed since the last time they were set." <pause> So React compares the new render with the last render. Then it changes only what differs between the two.

<!-- block h3-032 | src: "mistake changing the page by hand inside a" -->
<pause> Here's a mistake. Changing the page by hand, inside a React component.

<!-- block p-167 | src: "a developer who is used to plain javascript" -->
A developer who is used to plain JavaScript might turn Apply off the old way, inside the React handler. <pause> The button gets an id, and the handler finds it.

<!-- block code-035 | src: "src components promocode jsx 12 async function handlesubmit" -->
Watch line fourteen in this version of handle submit. <pause> Line thirteen still calls prevent default. But line fourteen calls document dot get element by id, with the string apply button, and sets its disabled to true. <breath> The note marks it as wrong... our code changes the button behind React's back. <pause> The rest is the same as before. The try, the await on check code, success on line seventeen, and error in the catch.

<!-- block p-168 | src: "the button still has its condition from state" -->
The button still has its condition from state.

<!-- block code-036 | src: "src components promocode jsx 32 button id apply" -->
Only three lines this time, thirty-two to thirty-four. <pause> The button now has an id, apply button. And it's still disabled when the code is empty, or when status is checking. <pause> The word on it is still Apply.

<!-- block p-169 | src: "the shopper types welcom and clicks apply this" -->
The shopper types Welcom, and clicks Apply. <pause> This handler never asks for the checking look. <breath> So during the wait, the page shows no Checking... line, and the box keeps working. Only Apply is off. <pause> Then the server says no, and the page looks like this.

<!-- block fig-031 | src: "localhost 5173 promo code welcom apply this code" -->
Figure thirty-one. At first glance, it looks right... the box says Welcom, and the red line says This code is not valid. <pause> But Apply is still disabled. <sigh> That's the handler that turned Apply off by hand.

<!-- block p-170 | src: "now the shopper fixes the code to welcome" -->
Now the shopper fixes the code to Welcome... but Apply stays off. <pause> The shopper cannot try again. <breath> Here is what happened, in order.

<!-- block list-030 | src: "on the last render before the click status" -->
Let's start before the click. <pause> On the last render, status was typing, and the box was not empty. So the JSX said disabled equals false, in curly braces, for Apply. <breath> The click ran our line, which set disabled to true directly on the button. React knows nothing about this. <pause> The server said no, and catch asked for the error look. React drew the component again. <breath> In the new render, the JSX again says disabled is false for Apply. The look is now error, and the box is still not empty. <pause> React compares the two renders. Apply's disabled was false last time... and it is false again. Nothing changed, so React does not touch the button. <breath> The button keeps the true that our code wrote. Apply stays off. <pause> And then the shopper types the E. React draws again, and disabled is still false in both renders. <pause> So React still does not touch the button.

<!-- block p-171 | src: "the fix is to name the next look" -->
The fix is to name the next look, and nothing else. <pause> Replace our line with the setter call for the checking look, as in the handler of the previous section. <breath> Then the checking render says disabled is true, and the error render says disabled is false. <pause> The two renders differ... so React turns the button back on.

<!-- block fig-032 | src: "two ways to turn apply off during the" -->
Two ways to turn Apply off during the check, that's figure thirty-two. <pause> By hand, with get element by id and disabled set to true, React's last render said false, and the error render also says false. React sees no change, so Apply stays off. <breath> With state, calling set status with checking, the checking render says true, and the error render says false. <pause> React sees a change... and turns Apply on again.

<!-- part -->

<!-- block h3-033 | src: "adding a new look later" -->
<pause> And last, adding a new look later.

<!-- block p-172 | src: "the react version is longer than the plain" -->
The React version is longer than the plain one. <pause> The React docs admit it. The React code "is longer than the original imperative example"... <pause> but it is "much less fragile".

<!-- block p-173 | src: "here is what less fragile means in practice" -->
Here is what less fragile means in practice. <pause> Suppose the shop's server could later answer that a code has expired. <breath> In React, we add one more value to the list, the string expired. We add one more line of JSX. It shows This code has expired, when status is expired. <pause> The other looks do not change at all. <breath> The docs say this way of working "lets you later introduce new visual states without breaking existing ones". <pause> In the plain version... every handler would need one more hide command for the new line.

<!-- block p-174 | src: "three later lessons go further lesson 22 covers" -->
Three later lessons go further. <pause> Lesson twenty-two covers in full which values should not be state at all. Lesson twenty-seven moves the logic of many looks into a reducer. <breath> And Lessons forty-one to forty-four show React nineteen form actions, which give you a waiting flag... without a hand-made status.

<!-- block box-006 | src: "principle 5 handlers set state the handler names" -->
<pause> And here's the last card. Principle five. Handlers set state. The handler names the next look, and React changes the page. <breath> Make each handler call a setter, and nothing else on the page. Let the JSX decide what is turned off, shown, hidden, or styled, for each look. <pause> Old habits die hard. <chuckles> You reach for get element by id inside a React handler, because it is quicker, and it seems to work. <pause> Then the server says no... and the button stays off forever. <breath> You see, React only changes what is different between its last render and its new one, and your hand-made change is not in either of them. <pause> So never edit the page behind React's back. Call the setter for the next look, and React will turn things on and off for you. <breath> The box shows it in two tiny handlers. The one to follow calls prevent default, then set status with checking, and its note says the JSX for checking turns the box and Apply off. <pause> The one to avoid calls prevent default, then get element by id on apply button, and sets disabled to true. Its note says it is wrong... React never turns this button back on.

<!-- block h2-007 | src: "synthesis putting all five principles together" -->
<pause> Now the synthesis. <pause> Putting all five principles together.

<!-- block h3-034 | src: "the complete project files" -->
First... the complete project files.

<!-- block p-175 | src: "here are the files of our react page" -->
Here are the files of our React page. <breath> The fake server answers after one and a half seconds.

<!-- block code-037 | src: "src checkcode js 1 export function checkcode code" -->
We start with the fake server itself, in source, check code dot js. <pause> It exports one function, check code, which takes the code and returns a promise. <breath> Inside, a set timeout waits fifteen hundred milliseconds. Then, if the code is the string Welcome, the promise resolves. <pause> Any other code, and it rejects, with a new error that says, This code is not valid.

<!-- block p-176 | src: "the stylesheet holds the classes for both versions" -->
The stylesheet holds the classes for both versions of the page.

<!-- block code-038 | src: "src index css 1 hidden display none 2" -->
The stylesheet hasn't changed... index dot css, still the same three rules. <pause> The class hidden gets display, none. <breath> The class error gets the color red. <pause> And the class code box, double dash, error, gets a border, two pixels, solid, red.

<!-- block p-177 | src: "the entry file mounts app into the root" -->
The entry file mounts App into the root div of index dot html.

<!-- block code-039 | src: "src main jsx 1 import strictmode from react" -->
What does main dot jsx actually do? <pause> Not much, and that's the point. It imports strict mode from react, create root from react dom client, our App component, and the stylesheet. <breath> Then on line six, it calls create root on document dot get element by id, root... and renders App, wrapped inside strict mode.

<!-- block p-178 | src: "the main file renders one promo code box" -->
The main file renders one promo code box.

<!-- block code-040 | src: "src app jsx 1 import promocode from components" -->
App dot jsx is even shorter. <pause> It imports promo code from the components folder, and the App function returns one promo code tag. <pause> That's all.

<!-- block p-179 | src: "the promo code box holds the two pieces" -->
The promo code box holds the two pieces of essential state... <pause> one handler that only sets the next look, <breath> and JSX that describes every look.

<!-- block code-041 | src: "src components promocode jsx 1 import usestate from" -->
And this is where all five principles live, in promo code dot jsx. <breath> Line five is principle four, the text in the box: code and set code, from use state with an empty string. <pause> Line six is principle four again, one string for the look: status and set status, starting at the string typing. <breath> Then line eight is principle two... the success look has no form. If status is success, the component returns only a paragraph, Code applied! You get free delivery. <pause> Now the handler, handle submit. It calls prevent default, then set status with the string checking. That's principle three, a human input. <breath> Then it awaits check code. If that works, set status, success... principle three, a computer input, yes. <pause> And in the catch, set status, error... a computer input, no. <breath> Notice the handler never touches an element. The JSX does all of that. On line twenty-seven, the input's class name is computed from state, that's principle five: code box with the error class when status is error, and plain code box otherwise. <pause> The input's value is code, its on change calls set code, and it's disabled while status is checking. <breath> The Apply button is disabled when the code is empty, or while checking. <pause> And at the bottom, a Checking line appears only while checking, and the line, This code is not valid, appears only on error.

<!-- block h3-035 | src: "how react calls the components" -->
<pause> Next, how React calls the components.

<!-- block p-180 | src: "when the page opens react starts at app" -->
When the page opens, React starts at App, and App renders the promo code box. <breath> On every later change, only the promo code box draws again... because only its state changed.

<!-- block fig-033 | src: "main jsx mounts app into root runs once" -->
Picture a small tree, read from the top down. That's figure thirty-three. <pause> At the top sits main dot jsx. It mounts App into the root div, and it runs once, when the page loads. <breath> Below it, step one, App. It's called first, and it returns the promo code tag. <pause> Then step two, promo code. It's called second... and again after every setter call. <breath> For typing, checking, and error, it returns the form. For success, it returns only the success line. <pause> So the figure shows the order in which React calls the components, and what the promo code box returns for each look.

<!-- part -->

<!-- block h3-036 | src: "how each look comes from state" -->
<pause> Now, how each look comes from state.

<!-- block p-181 | src: "every look of the box comes from two" -->
Every look of the box comes from two values. <pause> Here is the whole picture at once.

<!-- block table-004 | src: "look code status box apply line under the" -->
This table gathers the five looks, one at a time, with the code and the status for each. <breath> Empty first. The code is empty, the status is typing. The box works, Apply is off, and there's no line under the form. <pause> Typing. The code is Welcom, without the E, and the status is still typing. Now the box works and Apply works too, and there's still no line. <breath> Checking. Same code, status checking. The box is off, Apply is off, and the line under the form says Checking. <pause> Error. Same code, status error. The box works, with a red border, Apply works, and the line says, This code is not valid. <breath> And success. The code is the full Welcome, the status is success. There's no form at all, no box, no button... just the line, Code applied! You get free delivery.

<!-- block p-182 | src: "here is each plain javascript habit next to" -->
Here is each plain JavaScript habit, next to the React rule that replaces it.

<!-- block table-005 | src: "aspect the plain javascript habit the react rule" -->
So, five habits, and five replacements. <breath> Changing the page. The plain JavaScript habit is to give a command to every element in every handler... and forget one, so two lines show together. <pause> The React rule: describe each look once in JSX, and let the handler change only state. <breath> Planning. The habit is to start with the handlers, and forget the waiting look, so a second click sends the code twice. <pause> The rule: list every look first, and draw each one from a status prop. <breath> Triggers. The habit is to plan only for clicks and for the server's yes... so a no leaves the page stuck. <pause> The rule: list human inputs and computer inputs, and make each one call a setter. <breath> State. The habit is one true or false value for each look, so two looks can be on at once. <pause> The rule: keep one status string, and compute the rest, such as whether code dot length is zero. <breath> And classes and switches. The habit is to add classes and set disabled by hand... so React later leaves a button off. <pause> The rule: compute class name and disabled from state, and let React change the page.

<!-- block h2-008 | src: "interview prep for the interview" -->
<pause> And that brings us to interview prep. <pause> For the interview.

<!-- block question-002 | src: "the interview question how do you design a" -->
Here's the interview question again. <breath> How do you design a component that reacts to input with state... instead of touching the DOM?

<!-- block h3-037 | src: "how to answer clearly in 30 seconds" -->
How to answer it clearly, in thirty seconds.

<!-- block p-183 | src: "in plain javascript the code is imperative every" -->
In plain JavaScript, the code is imperative. <pause> Every handler commands each element: disable this button, show that message. <breath> With many looks, one forgotten command leaves the page in a look nobody designed... like an error message and a success message on screen together. <pause> In React, I write declarative code instead, in five steps. <breath> First, I list every visual state the user can see, and I mock each one with a status prop, often all on one page, like a living styleguide. <pause> Second, I find what triggers each change. There are human inputs, like clicks and typing, and computer inputs, like a server's answer. <breath> Both must set state, and every look needs a way out, including the error path. <pause> Third, I represent the look with as little state as possible, usually one status string instead of several booleans. <breath> Four booleans allow sixteen combinations, while a string with four allowed values allows exactly four. <pause> Fourth, I remove any state that causes a paradox, repeats other state, or can be computed... such as whether the text is empty. <breath> Fifth, I connect the event handlers so they only call setters. The JSX decides what is disabled, shown, or styled, and React changes only the parts of the page that differ from the last render. <pause> That is also why I never edit the DOM by hand inside a component. <pause> React will not undo a change it did not make.

<!-- block h3-038 | src: "three classic follow up questions interviewers ask" -->
<pause> Then, three classic follow up questions interviewers ask.

<!-- block list-031 | src: "why use one status string instead of several" -->
The first one. <pause> Why use one status string, instead of several booleans like is loading and is error? <breath> Well, every boolean doubles the number of possible combinations. Four booleans give sixteen, but a form like a promo code box has only four or five real looks. <pause> So most combinations are impossible states... and they do happen in practice. <breath> Say the error branch sets is error to true, and forgets to set is loading to false. Then the page shows an error while the input is still disabled, and the user cannot fix it. <pause> One status holds exactly one value, so setting the string error replaces the string checking by itself. <breath> When you need a boolean in the JSX, compute it. For example, a constant is checking, equal to whether status is the string checking. <pause> The second question. What goes wrong if you change the DOM directly inside a React component? <breath> React does not read the page to decide what to change. It compares its new render with its last render, and it only touches properties that differ. <pause> Say a handler sets disabled on a button with get element by id. The JSX may say disabled equals false, in curly braces, both before and after... so React sees no change, and never turns the button back on. <breath> The page and React's picture of it no longer match. <pause> The fix is to call a setter for the next look, and let the JSX compute disabled, class name, and which elements appear. <breath> And the third question. How does a network response change the page, if no one clicks anything? <pause> A network response is a computer input. In an async handler, the code before await runs on the click. <breath> React draws that state, such as checking, while the handler waits. When the promise has its answer, the handler goes on and calls the setter for the next look: success after await, or error inside catch. Then React draws again. <pause> There are two traps. Without catch, a refused request leaves the page stuck on its waiting look. <breath> And after await, the status variable still holds the value from the render that created the handler. <pause> So the handler should set the next look directly, instead of reading status.

<!-- block fig-034 | src: "two ways to make a form react to" -->
One last picture, figure thirty-four, the comparison to keep in mind for the interview. <pause> It's titled, Two ways to make a form react to input, and it branches into three. <breath> The first branch is imperative: class list, and disabled set to true. Each handler commands every element, and one forgotten command leaves an old line on screen. <pause> The second is many booleans, like is checking and is error. The looks are described, but sixteen combinations are possible... and a forgotten reset shows an error on a box that is still off. <breath> The third is one status, and declarative JSX: status, and set status. Each handler only names the next look. <pause> React changes only what differs, and old lines cannot stay behind. <breath> So, commanding the page by hand... versus describing each look and setting state. <pause> That's the whole lecture.
