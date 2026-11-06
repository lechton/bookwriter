---
chapter: 20
voice: Enzo
style: breath
---

<!-- block title-001 | src: "20 lecture 20 react 19 foundations controlled inputs" -->
Lecture twenty. <pause> Controlled Inputs... letting state decide what every box shows.

<!-- block question-001 | src: "interview question core how do you make an" -->
The interview question behind this lecture is a core one, and you will hear it a lot. <breath> How do you make an input, a text area, or a select... fully controlled by React state?

<!-- block h2-001 | src: "overview why a form needs its text in" -->
<pause> First, the overview. Why a form needs its text in state.

<!-- block h3-001 | src: "the smallest controlled box a name a greeting" -->
And we begin small. A name, a greeting, and a Clear button.

<!-- block p-001 | src: "here is a tiny page with one box" -->
Here is a tiny page with one box, one greeting, and one button. <pause> When the page opens, the box is empty.

<!-- block fig-001 | src: "localhost 5173 name hello clear figure 1 the" -->
In figure one, the browser shows localhost five one seven three. <pause> There's a label, Name, with an empty box next to it. Under that, a line that just says Hello, with a comma and nothing after it. And then a Clear button.

<!-- block p-002 code-001 | src: "this is all the code behind it" -->
This is all the code behind it, in App dot jsx, and it's short. <pause> Line one imports use state from React. Line three starts our component, App. <breath> Line four makes a piece of state called name, with its setter, set name, and it starts as an empty string. Then the page itself. Inside a main tag there's a label with the word Name, and inside the label, on line ten, the input. It gets value equals name, in curly braces... and an on change that takes the event e, and calls set name with e dot target dot value. <pause> Line twelve is a paragraph: Hello, comma, and then name in curly braces. And line thirteen is the button. Its on click calls set name with an empty string. The note beside it says it plainly: Clear changes only the state.

<!-- block p-003 fig-002 | src: "the user types john the greeting follows the" -->
Now the user types John. <pause> And the greeting follows the box, letter by letter. In figure two, the Name box holds John... and the line under it reads Hello, John.

<!-- block p-004 fig-003 | src: "then the user clicks clear and both the" -->
Then the user clicks Clear. <breath> Figure three is the page right after that click, and it looks just like the page when it opened. The box is empty, and the greeting is back to Hello, with nothing after it.

<!-- block p-005 | src: "look at the clear button once more its" -->
Look at the Clear button once more. <pause> Its code only puts an empty string into name. No line of our code touches the box. <long-pause> So... who empties the box?

<!-- block p-006 | src: "the two props on the box do react" -->
The two props on the box do. React understands both of them, on every input.

<!-- block list-001 | src: "onchange is our function and react calls it" -->
On change is our function, and React calls it every time the user changes the text in the box. Here, it saves the new text in name. <pause> And value tells React what the box must show. Here it says: show whatever name holds, right now.

<!-- block p-007 | src: "now the click makes sense here is what" -->
<breath> Now the click makes sense. This is what happens, in order.

<!-- block list-002 | src: "the user clicks clear and setname saves an" -->
The user clicks Clear, and set name saves an empty string in name. React renders App again. <pause> The greeting reads name, so it shows only Hello. And the box also reads name, through value... so React makes the box empty too.

<!-- block p-008 | src: "think of a classroom whiteboard the students call" -->
Think of a classroom whiteboard. <pause> The students call out their answers, but only the teacher writes on the board. The board shows only what the teacher wrote. <breath> Our box works the same way. The user calls out letters, through on change. Only our state writes the text. And the box shows only what state holds, through value.

<!-- block p-009 | src: "a box that works like this is called" -->
A box that works like this is called a controlled box, because React state controls what it shows. <pause> Principles one and two look at each of the two props on its own.

<!-- part -->

<!-- block h3-002 | src: "the real page a contact form that counts" -->
<pause> Next, the real page. A contact form that counts... and clears.

<!-- block p-010 | src: "now think of the contact form of an" -->
Now think of the contact form of an online shop. Under the message box, a small line counts the letters as the user types, something like twelve out of two hundred. <breath> This form needs two things from its boxes.

<!-- block p-011 | src: "first the count must change on every key" -->
First, the count must change on every key. <pause> So the text must reach state on every key, not only when the user clicks Send.

<!-- block p-012 | src: "second after send every box must be empty" -->
Second, after Send, every box must be empty again, ready for the next message. Our code empties the state. <pause> So state must be able to reach back into the box... and empty it too.

<!-- block p-013 | src: "a box that only reports to state fails" -->
A box that only reports to state fails the second job. A box that only listens to state fails the first job. <pause> This lecture shows how one box does both jobs.

<!-- block h3-003 | src: "our example page the contact us form" -->
<pause> Let's meet our example page. The Contact Us form.

<!-- block p-014 | src: "our page is the contact us form of" -->
Our page is the Contact Us form of an online shop. It has a Name box, a Topic menu, a Message box with its count, a tick box called Email me a reply, and a Send button. <breath> When the tick box is ticked, an Email box appears. And this is the finished page.

<!-- block fig-004 | src: "localhost 5173 contact us name topic delivery message" -->
Figure four shows it the way it looks when the page opens. <pause> A heading, Contact Us. A Name box. A Topic menu, already showing Delivery. Then a Message box, and under it the count, zero out of two hundred. <breath> Below that, the tick box, Email me a reply, still unticked... and the Send button at the bottom.

<!-- block p-015 | src: "the project has four files the whole form" -->
The project has four files. <pause> The whole form lives in one component, Contact Form.

<!-- block fig-005 | src: "contact page file explorer file directory role architectural" -->
Figure five lays those files out like a file explorer for the project, contact page, with the job of each file beside it. <pause> At the top is index dot html, the entry. It's the HTML page with the empty root div, where React mounts. <breath> Then the src folder, which holds the component modules. Main dot jsx is the boundary: it imports App, and mounts it inside Strict Mode, into the root div. App dot jsx is the parent. It exports App as default, and renders Contact Form. <pause> And inside the components folder sits Contact Form dot jsx, the default export, which holds every box and its state.

<!-- block p-016 code-002 | src: "the main component only places the form on" -->
The main component only places the form on the page, and you can see how little it does. <pause> In App dot jsx, line one imports Contact Form from the components folder. Line three starts App... and line four just returns the Contact Form tag. <breath> The note there says React calls Contact Form, which holds the whole form. That's it.

<!-- block p-017 | src: "we start with only the message box and" -->
We start with only the message box and its count. <pause> Each principle adds one more part, until the form is finished.

<!-- block p-018 | src: "a few ideas from earlier lessons come back" -->
A few ideas from earlier lessons come back here.

<!-- block list-003 | src: "usestate keeps a value between renders and calling" -->
From Lesson twelve: use state keeps a value between renders, and calling its setter makes React render the component again. <pause> From Lesson eleven: React hands every event handler an event object, e, and e dot target is the element where the event started. <breath> Inside a handler on a box, e dot target dot value is the text in the box. You met that once, in Lesson seventeen. <pause> Also from Lesson eleven: a form's submit handler calls e dot prevent default, so the browser does not reload the page. <pause> And from Lesson eighteen: a label tag around a box makes its text clickable... and a tick box keeps its own tick, inside the browser.

<!-- part -->

<!-- block h3-004 | src: "five principles of controlled inputs" -->
<pause> And now, the five principles of controlled inputs.

<!-- block box-001 | src: "principles onchange sends every key into state react" -->
Here they are, gathered in one place. <pause> One. On change sends every key into state. React calls it on every key, so the count can follow each letter. <breath> Two. Value sends state back into the box. Then setting state is enough to empty the box after Send. A prop that only sets the starting text cannot do this. <pause> Three. Value without on change freezes the box. React puts the old text back after every key... and the Console shows an error. <breath> Four. A menu and a tick box use the same pair. The menu takes its choice from state. The tick box takes its tick from state, and its handler reads the tick, not the text. <pause> And five. A controlled box starts with an empty string. If it starts with nothing at all, React warns as soon as the user types.

<!-- block p-019 | src: "here is the map of the five principles" -->
Before we walk through each one, there's a map of all five.

<!-- block table-001 | src: "principle why it matters in debugging and interviews" -->
The table gives each principle three things: its name, why it matters in debugging and interviews, and the React rule. <pause> Principle one, on change sends every key into state. A count or a greeting that never moves means the typed text never reached state, and interviewers also ask why React's on change fires on every key. The rule: give the box on change, and save the new text with the setter on every key. <breath> Principle two, value sends state back into the box. A form that keeps its old text after Send, while the count says zero, is the most common form bug. So give the box value from state, and the box always shows what state holds. <pause> Principle three, value without on change freezes the box. A box that refuses every letter looks broken, and the Console error explains why. Every box with value also needs an on change that saves the new text right away. <breath> Principle four, the same pair on a menu and a tick box. A tick box that will not untick, or a menu that ignores its starting choice, comes from the habits of plain HTML. Put the chosen value on the menu itself, give the tick box its tick from state, and read the tick back from the browser. <pause> And principle five, a controlled box starts with an empty string. A warning about a box changing from uncontrolled to controlled shows up on the first key... and it confuses many developers. <exhales> The fix is simple: start the state behind every box with an empty string, never with nothing.

<!-- part -->

<!-- block h2-002 | src: "section 1 principle 1 onchange sends every key" -->
<pause> Section one. Principle one. <pause> On change sends every key into state.

<!-- block h3-005 | src: "the smallest version a greeting that follows each" -->
Let's begin with the smallest version. <pause> A greeting that follows each letter.

<!-- block p-020 | src: "let s take the name box apart and" -->
Let's take the name box apart, and look at one prop at a time. <breath> First, we keep only on change, and leave out value for now. When the page opens, the box is empty... and the greeting says only Hello.

<!-- block fig-006 | src: "localhost 5173 name hello figure 6 a name" -->
That's what figure six shows. A browser window at localhost five one seven three, with a box labelled Name, still empty. <pause> And under it, a single line that says Hello, with nothing after it yet.

<!-- block p-021 | src: "the box hands each change to our code" -->
The box hands each change to our code.

<!-- block code-003 | src: "src app jsx 1 import usestate from react" -->
This file is App dot jsx, inside the src folder. <pause> Line one imports use state from React. Line three starts the App component, and line four makes a piece of state called name, with its setter, set name. It starts as an empty string. <breath> Then inside the main tag there's a label, with the word Name, and on line ten, the input. It has only one prop, on change, and that's a small arrow. It takes e, and calls set name with e dot target dot value. <pause> The note there says React calls this arrow on every key. And on line twelve, a paragraph says Hello, then name in curly braces.

<!-- block p-022 | src: "the user types j and the greeting says" -->
Now the user types J, and the greeting says Hello, J. <pause> Then o... and it says Hello, Jo. After four keys, the page looks like this.

<!-- block fig-007 | src: "localhost 5173 name john hello john figure 7" -->
In figure seven, it's the same page, after the user types John. <pause> The box holds John, and right under it the greeting reads Hello, John. It followed every letter.

<!-- block p-023 | src: "you met onchange at the start of the" -->
You met on change at the start of the lecture. React understands it on every input, text area, and menu. <breath> React calls it each time the user changes the text in the box. <pause> That means on every single key... not only when the user leaves the box.

<!-- block p-024 | src: "our arrow takes the text from e target" -->
Our arrow takes the text from e dot target dot value, and saves it with set name. <pause> The new state makes React render the greeting again.

<!-- block p-025 | src: "think of a student who calls out each" -->
<breath> Think of a student who calls out each letter to the teacher, while writing a word on paper. <pause> The teacher hears every letter, not only the finished word.

<!-- block h3-006 | src: "the message box and its live count" -->
<pause> Now, the message box... and its live count.

<!-- block p-026 | src: "now we build the first part of our" -->
Now we build the first part of our contact form. A heading, a Message box, and the count under it.

<!-- block code-004 | src: "src components contactform jsx 1 import usestate from" -->
So this one is ContactForm dot jsx, in the components folder. <pause> After the import, line four makes our state, message, with set message, starting as an empty string. <breath> Lines six to eight are a named handler, handle message change. It takes the event, e, and calls set message with e dot target dot value. That's all it does. <pause> Then we return a section, with a heading that says Contact Us, and a form. Inside the form, a label with the word Message, and on line sixteen, a text area tag whose on change is handle message change. Again, React calls the handler on every key. <breath> And line eighteen is the count. A paragraph with message dot length in curly braces, then a slash, then two hundred.

<!-- block p-027 | src: "the count uses length the number of characters" -->
The count uses dot length, the number of characters in a string. <pause> When the page opens, message is empty, so the count shows zero.

<!-- block fig-008 | src: "localhost 5173 contact us message 0 200 figure" -->
Figure eight is the first version of the Contact Us form, just as the page opens. <pause> There's the heading, Contact Us, an empty Message box, and below it the count... zero out of two hundred.

<!-- block p-028 | src: "the user types where is my parcel and" -->
The user types, Where is my parcel? <pause> And the count moves with every letter.

<!-- block fig-009 | src: "localhost 5173 contact us message where is my" -->
And figure nine shows the same form afterwards. The Message box now holds, Where is my parcel? <pause> And the count under it has climbed to nineteen out of two hundred.

<!-- block p-029 | src: "the count changed after every single letter who" -->
The count changed after every single letter. <pause> So who tells our code about each letter? <breath> Here is what happens on every key, in order.

<!-- block list-004 | src: "the user presses a key in the message" -->
The user presses a key in the Message box. The browser puts the letter into the box first. <pause> Only then does React call handle message change, and it hands over the event object. <breath> E dot target dot value reads the whole text of the box... so the new letter is already inside. Set message saves that text in state. <pause> And React renders ContactForm again, and the count shows the new length.

<!-- block h3-007 | src: "react s onchange and the browser s change" -->
<pause> Here's something that trips people up. React's on change, and the browser's change event, are not the same.

<!-- block p-030 | src: "if you have written plain javascript this may" -->
If you have written plain JavaScript, this may surprise you. <pause> The browser has its own event called change... and it does not fire on every key. <breath> In plain JavaScript, there are two different events you can listen to on a text box.

<!-- block code-005 | src: "page js 1 messagebox addeventlistener change e console" -->
You can see both of them in page dot js, one per line. <pause> Line one tells message box to listen for change, in quotes, and logs e dot target dot value. That one runs only when the user leaves the box. <breath> Line two is almost the same, but it listens for input, in quotes. And that one runs on every key.

<!-- block p-031 | src: "the browser s change event waits until the" -->
The browser's change event waits until the user is done with the box, and clicks somewhere else. <pause> The browser's input event fires on every change.

<!-- block p-032 | src: "react s onchange behaves like the second line" -->
React's on change behaves like the second line, the input event. <pause> So the two share a name, but they are not the same. <breath> The browser's change event waits for the user to leave the box. React's on change... fires on every key.

<!-- block p-033 | src: "react also accepts oninput which does the same" -->
React also accepts on input, which does the same job. <pause> React code uses on change by long habit, so this book uses it too.

<!-- part -->

<!-- block h3-008 | src: "mistake keeping the message in a plain variable" -->
<pause> And now, a mistake. Keeping the message in a plain variable.

<!-- block p-034 | src: "a developer new to react might keep the" -->
If you're new to React, you might keep the text in a plain variable, the way plain JavaScript does.

<!-- block code-006 | src: "src components contactform jsx 1 export default function" -->
Same file, ContactForm dot jsx, but watch line two. <pause> There's no use state anymore. Instead, it says let message equal an empty string. <breath> And inside the handler, on line five, message equals e dot target dot value. The note marks it wrong... it changes a plain variable, so React never renders again. <pause> Everything else is just as before. The heading, the text area with its on change, and the count, message dot length out of two hundred.

<!-- block p-035 | src: "the user types hi the box shows hi" -->
The user types Hi. <pause> The box shows Hi... but the count stays at zero.

<!-- block fig-010 | src: "localhost 5173 contact us message hi 0 200" -->
Take a look at figure ten, the contact form with a plain variable, after the user types Hi. <pause> The word Hi is right there in the Message box. <sigh> And underneath, the count still reads zero out of two hundred.

<!-- block p-036 | src: "why does the box show hi while the" -->
So why does the box show Hi, while the count stays at zero? <pause> Here is what happens on each key.

<!-- block list-005 | src: "the browser puts the letter into the box" -->
The browser puts the letter into the box. The box has no value yet, so the browser keeps the letter there on its own. <pause> React calls handle message change, and the handler changes the plain variable. <breath> But changing a plain variable does not ask React to render again. So React never calls ContactForm again. <pause> The count on the page is still the one React drew when the page opened... and it says zero.

<!-- block p-037 | src: "there is a second problem even if something" -->
And there's a second problem. <pause> Even if something else made React render again, the first line of the component would run again. <breath> It would set message right back to an empty string.

<!-- block p-038 | src: "the fix is the state from lesson 12" -->
The fix is the state from Lesson twelve. <pause> The setter keeps the text between renders, and asks React to render again.

<!-- block code-007 | src: "src components contactform jsx 1 import usestate from" -->
Back in ContactForm dot jsx, the top of the file is fixed. <pause> Use state is imported again, and line four brings back message and set message, starting empty. <breath> And line seven, inside the handler, is set message with e dot target dot value. It saves the text, and asks React to render again.

<!-- block p-039 | src: "now the count follows every letter as in" -->
Now the count follows every letter, just like we saw before.

<!-- block h3-009 | src: "inside the handler message is still one letter" -->
<pause> One more thing. Inside the handler, message is still one letter behind.

<!-- block p-040 | src: "there is one more trap here suppose we" -->
There is one more trap here. <pause> Suppose we add a log line to the handler, just for a moment.

<!-- block code-008 | src: "src components contactform jsx 6 function handlemessagechange e" -->
It's only the handler this time, lines six to nine. <pause> The new line seven is console dot log of message, and the note says it shows the text from before this key. <breath> Then line eight is our usual set message, with e dot target dot value.

<!-- block p-041 | src: "the box holds wher and the user types" -->
The box holds Wher, W H E R, and the user types e. <pause> The Console shows Wher... not Where. <breath> Why the old text?

<!-- block p-042 | src: "in lesson 15 you saw that each render" -->
In Lesson fifteen, you saw that each render sees its own fixed state values. <pause> The handler belongs to a render too. Here is the order.

<!-- block list-006 | src: "when the box held wher react rendered contactform" -->
When the box held Wher, React rendered ContactForm. In that render, message is Wher, and the handler is made in that same render. <pause> The user types e, and the browser puts it into the box. React calls the handler from that render. <breath> Inside it, message is still Wher. Set message saves Where... but only the next render will see it.

<!-- block p-043 | src: "so inside the handler the new text lives" -->
So inside the handler, the new text lives only in e dot target dot value. <pause> That's why the handler saves e dot target dot value, and never builds the new text from message. <breath> And now we take the log line out again, before we go on.

<!-- block box-002 | src: "principle 1 onchange react calls it on every" -->
<pause> So, principle one. On change... React calls it on every key. <breath> When the page must react to what the user types, give the box on change, and save e dot target dot value with the setter. The count must move while the user types, so the text must reach state on every key. <pause> React's on change is not the browser's change event, which waits for the user to leave the box. It fires on every key, like the browser's input event. <breath> By the time it runs, the browser has already put the new letter into the box, so e dot target dot value holds the whole new text. A plain variable cannot do this job, because changing it never makes React render again. <pause> The right way looks like this. Const message and set message, from use state with an empty string, and a text area tag whose on change is an arrow calling set message with e dot target dot value. That saves the whole text on every key. <breath> The wrong way is let message equal an empty string, and an on change arrow that just assigns e dot target dot value to message. A plain variable like that... never makes React render again.

<!-- part -->

<!-- block h2-003 | src: "section 2 principle 2 value sends state back" -->
<pause> Now we move into Section two, and with it, Principle two. <pause> Value sends state back into the box.

<!-- block h3-010 | src: "the smallest version one clear button two different" -->
We'll start small. <pause> One Clear button... and two different boxes.

<!-- block p-044 | src: "go back to the name page from the" -->
Go back to the name page from the start of the lecture. <breath> We change only one prop on the box, and we try it two ways. In both versions, the user types John... and then clicks Clear.

<!-- block fig-011 | src: "defaultvalue on the box box keeps john src" -->
Figure eleven puts the two versions side by side. <pause> On the left, the label says default value on the box, and the box keeps John. Line ten of App dot jsx is an input with default value equals an empty string, in quotes, and an on change that takes e and calls set name with e dot target dot value. The note says it sets only the starting text. <breath> Below it, the browser shows the Name box still holding John, the greeting reading just Hello, and the Clear button. So the greeting is empty... but the box still shows John. <long-pause> On the right, the label says value on the box, and the box empties. Here line ten has value equals name, in curly braces, with the same on change. The note says it shows whatever name holds. <pause> And in that browser, the Name box is empty, the greeting is just Hello, and Clear sits underneath. The greeting and the box are both empty.

<!-- block h3-011 | src: "why the box with defaultvalue keeps john" -->
<pause> So why does the box with default value keep John?

<!-- block p-045 | src: "while the user types the two boxes behave" -->
While the user types, the two boxes behave exactly the same. <pause> Only Clear shows the difference. So why does the left box hold on to John?

<!-- block p-046 | src: "the answer is in what defaultvalue does defaultvalue" -->
The answer is in what default value does. <breath> Default value is a React prop that gives the box its starting text... and nothing more. React writes it into the box once, when the box first appears. <pause> After that, the box keeps whatever the user types, and React never changes it again.

<!-- block p-047 | src: "here is what happens in the left column" -->
Let's follow the left column after the click, step by step.

<!-- block list-007 | src: "the user clicks clear and setname saves an" -->
The user clicks Clear, and set name saves an empty string. React renders App again. <pause> The greeting reads name, so it shows only Hello. <breath> But the box has no value prop. Its default value was used once, when the page opened. So on this render, React writes nothing into the box. <pause> The browser still holds John inside the box... so the box keeps it.

<!-- block p-048 | src: "value works the other way it is a" -->
Value works the other way. <pause> It's a React prop too, but React writes it into the box after every render. In the right column, the first two steps are the same. Then the story changes.

<!-- block list-008 | src: "react reads value and name is now an" -->
React reads value, and name is now an empty string. <pause> So React writes that empty text into the box. And the box is empty, just like the greeting.

<!-- block p-049 | src: "react s documentation says it plainly with defaultvalue" -->
React's documentation says it plainly. With default value, your code "only specifies the initial value. <pause> It does not control what the value should be right now."

<!-- block p-050 | src: "think of a student s own notebook on" -->
<breath> Think of a student's own notebook. On the first day, the teacher writes one line on page one. That's default value. <pause> After that, the student writes freely, and the teacher cannot erase anything from the front of the room. <pause> A box like this, without value, is called an uncontrolled box. It keeps its own text.

<!-- block p-051 | src: "a box with value from state and onchange" -->
And a box with value from state, and on change back into state? That's the whiteboard from the start of the lecture. <pause> It's a controlled box. React's documentation puts it this way: "React will force the input to always have the value you passed."

<!-- block h3-012 | src: "with value why can i still type" -->
<pause> Which raises a fair question. With value... why can I still type?

<!-- block p-052 | src: "if react forces the box to show name" -->
If React forces the box to show name, how does a new letter ever get in? <breath> Watch what happens on every key in the right column.

<!-- block list-009 | src: "the user presses a key and the browser" -->
The user presses a key, and the browser shows the letter in the box. React calls on change, and set name saves the new text. <pause> React renders again, and value is now the new text. So React writes that same text into the box... and the letter stays.

<!-- block p-053 | src: "the letter survives because state already holds it" -->
<pause> The letter survives because state already holds it when React writes the box again.

<!-- part -->

<!-- block h3-013 | src: "the send button that empties state but not" -->
<pause> Next up, the Send button that empties state... but not the box.

<!-- block p-054 | src: "back to our contact form now we add" -->
Back to our contact form. <pause> Now we add a Send button. When the form is sent, our code logs the message and empties the state, so the form is ready for the next message.

<!-- block code-009 | src: "src components contactform jsx 10 function handlesend e" -->
This bit lives in ContactForm dot jsx, starting at line ten, with a function called handle send that takes e. <pause> Line eleven calls e dot prevent default, so the page doesn't reload. Line twelve logs Sent, followed by the message, to the Console. <breath> And line thirteen calls set message with an empty string. The note says it empties the state after sending. Then line fourteen closes the function.

<!-- block p-055 | src: "the developer wants the message box to start" -->
Now, we want the Message box to start empty. <pause> So, the obvious move... we give it default value with an empty string.

<!-- block code-010 | src: "src components contactform jsx 16 return 17 section" -->
Further down the same file, from line sixteen, is the return. <pause> There's a section, a heading that says Contact Us, and on line nineteen a form whose on submit is handle send, in curly braces. Inside the label, Message, line twenty-two is the one to watch. <breath> A text area tag with default value equals an empty string, and on change set to handle message change. The note marks it wrong. Starting text only, so Send cannot empty the box. <pause> Line twenty-four is a paragraph showing message dot length, out of two hundred. And line twenty-five is the Send button, with type submit. The rest just closes the form, the section, and the component.

<!-- block p-056 | src: "while the user types where is my parcel" -->
While the user types, Where is my parcel? everything works, and the count says nineteen out of two hundred. <pause> Then the user clicks Send.

<!-- block fig-012 | src: "localhost 5173 contact us message where is my" -->
<long-pause> And figure twelve shows what we get. The page still says Contact Us, and the Message box still reads, Where is my parcel? <pause> But the count under it says zero out of two hundred. And down in the Console, there's one line: Sent, Where is my parcel? logged from ContactForm dot jsx, line twelve.

<!-- block p-057 | src: "the count says the box is empty but" -->
Hmm. The count says the box is empty, but the old message is still in the box. <pause> So who is right? Let's replay what happened, in order.

<!-- block list-010 | src: "while the user typed each key ran handlemessagechange" -->
While the user typed, each key ran handle message change, and message held the text. <pause> The user clicked Send, and handle send saved an empty string with set message. React rendered again. Message is now empty, so the count shows zero. <breath> But the text area has no value prop. So React writes no text into it on this render. <pause> The browser still holds the typed text inside the box... so the box keeps it.

<!-- block p-058 | src: "so state is right and the box is" -->
So state is right, and the box is out of date. <pause> If the user clicks Send again, the Console proves it. The second log is empty, because state holds an empty string.

<!-- block fig-013 | src: "localhost 5173 contact us message where is my" -->
That's figure thirteen, the same form after a second click on Send, with nothing new typed. <pause> The box still says Where is my parcel? and the count still says zero out of two hundred. <sigh> But the Console now has two lines. The first, Sent, Where is my parcel? And the second... just Sent, with nothing after it.

<!-- part -->

<!-- block h3-014 | src: "the fix value message on the text area" -->
<pause> The fix. Value equals message, in curly braces, on the text area.

<!-- block p-059 | src: "the fix is one prop on the text" -->
And honestly, the fix is just one prop on the text area.

<!-- block code-011 | src: "src components contactform jsx 20 label 21 message" -->
The change itself lives in ContactForm dot jsx, lines twenty to twenty-three. <pause> The label, the word Message, and then on line twenty-two, the text area tag now has value equals message, in curly braces, with the same on change, handle message change. <breath> The note says the box always shows what message holds. And line twenty-three closes the label.

<!-- block p-060 | src: "after a reload the user types the same" -->
After a reload, the user types the same message and clicks Send. <pause> Now the box and the count are both empty.

<!-- block fig-014 | src: "localhost 5173 contact us message 0 200 send" -->
<long-pause> In figure fourteen, the Message box is empty this time, and the count says zero out of two hundred. <pause> And the Console shows one line, Sent, Where is my parcel? from ContactForm dot jsx, line twelve. Everything agrees.

<!-- block p-061 | src: "no line of our code empties the box" -->
But wait. No line of our code empties the box itself. <pause> So why is it empty now? Here's the order.

<!-- block list-011 | src: "setmessage saves an empty string react renders contactform" -->
Set message saves an empty string. React renders ContactForm again. <pause> React reads value on the text area. It's now an empty string, so React writes that empty text into the box. <breath> The box is empty... and the count shows zero.

<!-- block h3-015 | src: "state is the single source of truth" -->
<pause> State is the single source of truth.

<!-- block p-062 | src: "our page now shows the message in two" -->
Our page now shows the message in two places, the box and the count. Both copy the same state. <breath> Think of a train station with one main clock. Every platform screen copies that clock. When the clock changes, every screen changes with it. <pause> Nobody sets a platform screen by hand.

<!-- block p-063 | src: "state is our main clock the box and" -->
State is our main clock. The box and the count are the screens. <pause> This idea is called a single source of truth. One place holds the text, and everything on the page copies it. <breath> So to change what the box shows, we never touch the box. We change the state.

<!-- block h3-016 | src: "an empty defaultvalue and value message are not" -->
<pause> And now a warning. An empty default value, and value equals message in curly braces, are not the same.

<!-- block p-064 | src: "when the page opens and message is empty" -->
When the page opens and message is empty, both versions draw the exact same empty box. So it's easy to think they're the same. <pause> But you saw where they split. At the first render after Send. <breath> In step three above, only value writes the empty string back into the box. Default value already did its one job, when the page opened.

<!-- block p-065 | src: "there is one more thing to notice the" -->
There's one more thing to notice. The message box in Principle one had on change... and it was still uncontrolled. <pause> On change only reports. Only value decides whether a box is controlled.

<!-- block p-066 | src: "one last note for readers who know html" -->
One last note, if you know HTML. In HTML, you write the starting text of a text area between its tags. <pause> React doesn't support that. The box still shows the text, but React prints a red error in the Console, and the error tells you to use default value or value instead. <breath> So in React, a text area gets its text from one of these two props, just like an input.

<!-- block box-003 | src: "principle 2 value react writes state into the" -->
<pause> Let's wrap up Principle two. Value. React writes state into the box after every render. <breath> When our code must change what the box shows, like emptying it after Send, give the box value from state. A box without value keeps its own text. Default value only sets the starting text, so after Send the count says zero while the old message stays in the box. <pause> With value from state, React writes the state into the box after every render. Then saving an empty string empties the box too, and state becomes the single source of truth. <breath> So, do this. A text area with value equals message, in curly braces, and an on change that takes e and calls set message with e dot target dot value. Setting message to an empty string now empties the box. <pause> And don't do this. The same text area with default value equals an empty string instead. That's starting text only... so the box keeps its text after Send.

<!-- part -->

<!-- block h2-004 | src: "section 3 principle 3 value without onchange freezes" -->
<pause> Now we come to Section three, and with it, Principle three. <pause> Value without on change... freezes the box.

<!-- block h3-017 | src: "the smallest version a box stuck on john" -->
Once again, we start with the smallest case. <pause> A box that's stuck on John.

<!-- block p-067 | src: "what if a box has value but no" -->
What if a box has value, but no on change? <breath> When the page opens, the box shows John... and the Console already shows a red error.

<!-- block fig-015 | src: "localhost 5173 name john console you provided a" -->
In figure fifteen, the browser is at localhost five one seven three. There's one box labeled Name, and it holds John. <pause> Below it, the Console has a red line. Put simply, React is complaining that we gave a form field a value without an on change handler. <breath> In its own words: you provided a value prop to a form field without an on change handler. This will render a read-only field. If the field should be mutable, use default value. Otherwise, set either on change or read only.

<!-- block p-068 | src: "the box has value and nothing else" -->
And the box itself? <pause> It has value, and nothing else.

<!-- block code-012 | src: "src app jsx 1 import usestate from react" -->
The file is App dot jsx, and it's tiny. Line one imports use state from React. Line three starts the App component. <breath> On line four, we make a piece of state called name, with its setter, set name, and it starts as John. Then the return wraps a label, with the word Name in it, and inside the label sits the input, on line nine. <pause> Its only prop is value equals name, in curly braces. The note next to it says it plainly: wrong, value without on change.

<!-- block p-069 | src: "the user clicks at the end of the" -->
Now the user clicks at the end of the box, and types two letters, n and y, to make Johnny. <pause> But the box still shows John.

<!-- block fig-016 | src: "localhost 5173 name john console you provided a" -->
Figure sixteen is the same page, after those two letters were typed. <pause> And honestly... it looks exactly like figure fifteen. The Name box still says John, and the same red read-only error sits in the Console.

<!-- block p-070 | src: "no line of our code removes the letters" -->
No line of our code removes the letters. <pause> So who removes them? <pause> React does. <breath> Here is what happens on every key, in order.

<!-- block list-012 | src: "the user presses n the browser puts n" -->
First, the user presses n. Second, the browser puts n into the box. <pause> Third, the box has no on change, so no code of ours runs, and name stays John. <breath> Fourth, React writes the value it was given, John, back into the box. And fifth... the box shows John again.

<!-- block p-071 | src: "remember the whiteboard a student calls out a" -->
Remember the whiteboard. <pause> A student calls out a letter, but the teacher is not listening. So the board never changes.

<!-- block h3-018 | src: "what the red error tells you" -->
<pause> So, what the red error is telling you.

<!-- block p-072 | src: "react prints this error while you develop whenever" -->
React prints this error while you develop, whenever a box has value and no on change. <pause> And it even offers three ways out.

<!-- block list-013 | src: "if the box should be editable add onchange" -->
If the box should be editable, add on change. <pause> If you only wanted a starting text, use default value instead. <breath> And if the box should really be frozen, say so with the read only prop. Then React knows you meant it... and the error goes away.

<!-- part -->

<!-- block h3-019 | src: "mistake the name box that refuses anna" -->
<pause> Here's a mistake you'll actually meet. <pause> The Name box that refuses Anna.

<!-- block p-073 | src: "back to our contact form the developer adds" -->
Back to our contact form. <breath> The developer adds a Name box above the message, and it gets its own state.

<!-- block code-013 | src: "src components contactform jsx 4 const name setname" -->
Up near the top of Contact Form dot jsx, there are now two state lines. Line four makes name, with set name, starting as an empty string. <pause> And line five is the one we already had, message, with set message, also starting empty.

<!-- block p-074 | src: "they remember from principle 2 that value lets" -->
They remember from Principle two that value lets Send empty the box. <pause> But in the markup... they forget on change.

<!-- block code-014 | src: "src components contactform jsx 20 form onsubmit handlesend" -->
Further down in the same file, line twenty opens the form, with on submit equals handle send, in curly braces. Then a label, the word Name, and on line twenty-three, the input. <pause> It has value equals name, in curly braces, and that's it. <breath> The note there says: wrong, no on change, so every letter is put back.

<!-- block p-075 | src: "the user clicks into the name box and" -->
The user clicks into the Name box and types Anna. <pause> The box stays empty. And the Console has shown the error since the page opened.

<!-- block fig-017 | src: "localhost 5173 contact us name message 0 200" -->
In figure seventeen we zoom out. It's the whole contact form now. A heading, Contact Us, then an empty Name box, a Message box, the counter showing zero out of two hundred, and the Send button. <long-pause> No Anna anywhere. And down in the Console, there's that same red line again, about a value prop without an on change handler... and a read-only field.

<!-- block p-076 | src: "the steps are the same as for john" -->
The steps are the same as for John. The browser shows each letter, no code saves it, and React writes the empty name back into the box. <breath> The fix is an on change, like the one the Message box already has.

<!-- block code-015 | src: "src components contactform jsx 21 label 22 name" -->
So on line twenty-three, the input gets a second prop. <pause> Next to value equals name, we add on change, and in the curly braces, an arrow function. It takes e, and calls set name with e dot target dot value. <breath> The note says it: each letter now reaches state.

<!-- block p-077 | src: "the send handler now logs the name too" -->
The Send handler now logs the name too... and empties it together with the message.

<!-- block code-016 | src: "src components contactform jsx 11 function handlesend e" -->
That's handle send, starting on line eleven, and it takes e. Line twelve calls e dot prevent default, so the page doesn't reload. <pause> Line thirteen logs the word Sent, then name, then message. <breath> And then two setters. Line fourteen calls set name with an empty string, so the Name box empties together with the message. And line fifteen calls set message with an empty string, like before.

<!-- block p-078 | src: "after a reload anna appears letter by letter" -->
After a reload, Anna appears letter by letter. <pause> And the Console is clean.

<!-- block fig-018 | src: "localhost 5173 contact us name anna message 0" -->
Figure eighteen shows it. Same contact form, but now the Name box says Anna. <pause> The Message box is still empty, the counter still reads zero out of two hundred... and the Console simply says, no errors or warnings.

<!-- block p-079 | src: "the broken box and the fixed box look" -->
The broken box and the fixed box look like the same box, with one extra prop. They even show the same empty text when the page opens. <pause> But they are not the same. <breath> They split at step three. Only the fixed box saves the letter in state... so only its letters survive.

<!-- part -->

<!-- block h3-020 | src: "refusing a letter on purpose the 200 limit" -->
<pause> Now, something a little different. <pause> Refusing a letter on purpose: the two hundred limit.

<!-- block p-080 | src: "react puts back whatever state says so can" -->
React puts back whatever state says. <pause> So can our code refuse a letter on purpose? Yes, it can. <breath> Our count already promises a limit of two hundred characters, so let's make the box keep that promise. We add one check to the message handler.

<!-- block code-017 | src: "src components contactform jsx 7 function handlemessagechange e" -->
On line seven of Contact Form dot jsx, handle message change takes e. <pause> Line eight is the new check: if e dot target dot value dot length is less than or equal to two hundred. The note says it saves the text only while it fits. <breath> Inside that if, line nine calls set message with e dot target dot value. And lines ten and eleven just close the if and the function.

<!-- block p-081 | src: "suppose the box already holds 200 characters and" -->
Suppose the box already holds two hundred characters... and the user types one more. <pause> Here is what happens.

<!-- block list-014 | src: "the browser puts the extra letter into the" -->
The browser puts the extra letter into the box. React calls handle message change. <pause> The new text is two hundred and one characters long, so the handler does not call set message. <breath> Message still holds the two hundred characters. So React writes those two hundred characters back into the box... and the extra letter disappears.

<!-- block p-082 | src: "this is the freeze from the start of" -->
This is the freeze from the start of this principle, used on purpose. <pause> The box accepts a letter only when our code saves it.

<!-- block h3-021 | src: "the handler must save e target value right" -->
<pause> And one more rule about the handler. <pause> It must save e dot target dot value, right away.

<!-- block p-083 | src: "the handler has two more rules it must" -->
The handler has two more rules. It must save the text right away, and it must save exactly e dot target dot value. <breath> Here is a Name handler that breaks the first rule. It saves the text later... inside a timer.

<!-- block code-018 | src: "a name box whose handler saves the text" -->
This is a Name box whose handler saves the text later. Line one starts handle name change, taking e. <pause> On line two, instead of saving, it calls set timeout. Inside, an arrow function calls set name with e dot target dot value, and the wait is one hundred milliseconds. <breath> The note there warns: wrong, the state waits, but React puts the old text back right away. And on line five, the input has value equals name, and on change equals handle name change, both in curly braces.

<!-- block p-084 | src: "the user types and the box still refuses" -->
The user types... and the box still refuses every letter. <pause> The handler does run, so why? Here is the order.

<!-- block list-015 | src: "the user presses a key and the browser" -->
The user presses a key, and the browser shows the letter in the box. React calls handle name change, but the handler only starts a timer. <pause> The handler ends, and name still holds the old text. State did not change, so React writes the old text back into the box. <breath> A moment later, the timer runs and reads e dot target dot value. That is the same box, and it now holds the old text again. <pause> So set name saves the old text, and nothing changes.

<!-- block p-085 | src: "this box refuses letters just like a box" -->
This box refuses letters just like a box with no on change. <pause> This time, though, the Console stays quiet, because the box does have a handler. <sigh> React's documentation says the state update cannot wait. It must happen inside the handler, right away.

<!-- block p-086 | src: "the second rule is broken by a handler" -->
The second rule is broken by a handler that saves a changed copy of the text. <pause> One example is a handler that turns every letter into a capital, with to upper case. <breath> The browser has just shown one text, and React then writes a different text into the box. React's documentation lists this as a cause of a caret that jumps around while the user types.

<!-- block p-087 | src: "so keep the handler simple save exactly e" -->
So keep the handler simple. <pause> Save exactly e dot target dot value, right away. And if you need to refuse a letter, refuse the whole change with an if... just as the two hundred limit does.

<!-- block box-004 | src: "principle 3 read only value without onchange freezes" -->
<pause> Let's gather Principle three into one place. Read only: value without on change freezes the box. <breath> Every box with value also needs an on change handler that saves the new text, exactly as typed, right away. With value, React writes the state into the box after every key. <pause> If no handler saves the new letter, state never changes, so React puts the old text back, and the Console shows the read-only field error. The same freeze happens when the handler waits inside a timer. And a box that should be frozen on purpose says so with read only. <breath> So, do this: an input with value equals name, and on change calling set name with e dot target dot value. Each letter reaches state, so it stays. <pause> And don't do this: an input with value equals name, and nothing else. No on change... so React puts the old text back after every key.

<!-- part -->

<!-- block h2-005 | src: "section 4 principle 4 the same pair on" -->
<pause> On to Section four, and Principle four. <pause> The same pair, on a menu and a tick box.

<!-- block h3-022 | src: "the smallest version a fruit menu and an" -->
As always, small first. <pause> A fruit menu... and an agree box.

<!-- block p-088 | src: "a drop down menu is a select and" -->
A drop-down menu is a select tag, and a tick box is an input tag with type equals checkbox. <breath> Both can be controlled with the same idea. When the page opens, the menu shows Orange, and the box is not ticked.

<!-- block fig-019 | src: "localhost 5173 fruit orange i agree figure 19" -->
Figure nineteen puts it on screen. A browser window at localhost five one seven three, with a menu labelled Fruit that reads Orange. <pause> Below it sits a small empty square, with the words I agree next to it.

<!-- block p-089 code-019 | src: "here is the code the menu uses value" -->
And now the code behind it. The menu uses value, like a text box. The tick box uses checked instead. <pause> In App dot jsx, line one imports use state from React. Line four makes fruit, with its setter, set fruit, and it starts as orange. <breath> Line five makes agree, with set agree, and that one starts as false. Then on line eleven, the select tag gets value equals fruit, in curly braces, and its on change takes e, arrow, set fruit with e dot target dot value. So the chosen option comes from state. <pause> Lines twelve to fourteen are the three option tags, apple, banana, and orange, each with its own value. <breath> And on line eighteen, the input with type equals checkbox gets checked equals agree, in curly braces. Its on change calls set agree with e dot target dot checked. So the tick comes from state too. Line nineteen is just the words, I agree.

<!-- block p-090 fig-020 | src: "the user picks banana and ticks the box" -->
<pause> The user picks Banana, and ticks the box. <pause> In figure twenty, it's the same page, but the menu now reads Banana... and the little square next to I agree has a tick in it.

<!-- block p-091 | src: "it is the same whiteboard as before now" -->
It is the same whiteboard as before. <breath> Now the board holds a chosen word and a ticked square... and only state writes them.

<!-- block h3-023 | src: "what value means on a menu" -->
<pause> So, what does value mean on a menu?

<!-- block p-092 list-016 | src: "on a select value says which option is" -->
On a select tag, value says which option is chosen. It must match the value of one of the options inside. <pause> And each option tag has two texts. <breath> The text between its tags, such as Banana, is what the user reads. Its value, such as banana with a small b, is the string the menu reports to our code.

<!-- block p-093 | src: "the user reads banana but our code receives" -->
So the user reads Banana, with a capital B... but our code receives banana with a small b. <pause> Where did that string come from? The browser supplies it.

<!-- block list-017 | src: "the user picks banana the menu s value" -->
It goes like this. The user picks Banana. The menu's value becomes the value of that option, which is banana. <pause> React calls on change, and e dot target dot value is banana. <breath> Set fruit saves banana, and React writes it back into the menu... so Banana stays chosen.

<!-- block h3-024 | src: "never mark an option as selected" -->
<pause> Next, a rule worth remembering. Never mark an option as selected.

<!-- block p-094 code-020 | src: "in plain html you choose the starting option" -->
In plain HTML, you choose the starting option by writing selected on that option. <breath> A developer who knows HTML might write something like this. A select tag, with two option tags inside. The first is Delivery. The second is Payment... and that one carries the word selected. <pause> That's the plain HTML habit, and it's marked wrong, because React does not support it.

<!-- block p-095 | src: "react does not support selected on an option" -->
React does not support selected on an option. <pause> The menu still opens on Payment, but React prints a red error in the Console. <breath> The error tells you to use value, or default value, on the select instead.

<!-- block p-096 code-021 | src: "the react way puts the choice on the" -->
The React way puts the choice on the select itself. <pause> So the select tag gets value equals payment, in quotes, and an on change that calls set topic with e dot target dot value. <breath> The two option tags, Delivery and Payment, stay plain, with no selected anywhere. React chooses the option whose value matches.

<!-- block p-097 | src: "react reads value on the select and chooses" -->
React reads value on the select, and chooses the option whose value matches. <pause> When the menu only needs a starting choice and no state, use default value on the select instead. It works the same way as default value on a text box.

<!-- block h3-025 | src: "what checked means on a tick box" -->
<pause> And what does checked mean, on a tick box?

<!-- block p-098 | src: "a tick box has no text to show" -->
A tick box has no text to show. It is either ticked, or not. <pause> So it does not use value. It uses checked, a React prop that holds true or false. <breath> After every render, React makes the box ticked or unticked to match.

<!-- block p-099 | src: "in lesson 18 a tick box without checked" -->
In Lesson eighteen, a tick box without checked kept its own tick inside the browser. That box was uncontrolled. <pause> With checked from state, React decides the tick... and the box becomes controlled.

<!-- block p-100 | src: "the handler reads e target checked which the" -->
The handler reads e dot target dot checked, which the browser supplies. <pause> It is the tick right after the click. True if the box is now ticked, and false if not.

<!-- block p-101 | src: "for a tick box that only needs a" -->
For a tick box that only needs a starting tick, React has default checked, which works like default value. <breath> And a tick box with checked but no on change freezes too, just like the frozen text box of Principle three. <pause> React prints the same read-only error, but this time it names checked and default checked.

<!-- part -->

<!-- block h3-026 | src: "the topic menu on the contact form" -->
<pause> Now, the Topic menu on the contact form.

<!-- block p-102 code-022 | src: "back to our contact form we add a" -->
Back to our contact form. We add a Topic menu that starts on Delivery. <pause> In ContactForm dot jsx, line four is our name state, starting as an empty string. <breath> Line five is the new one. Topic, with set topic, starting as delivery... so the menu starts on Delivery. And line six is the message state, also starting empty.

<!-- block p-103 code-023 | src: "the menu sits between the name box and" -->
The menu sits between the Name box and the Message box. <pause> It's a label with the word Topic, and inside it a select tag. Its value is topic, in curly braces, and its on change calls set topic with e dot target dot value. <breath> That value must match the value of one option. And there are three option tags: delivery, payment, and other, which the user reads as Delivery, Payment, and Other.

<!-- block p-104 fig-021 | src: "the user types anna and picks payment topic" -->
The user types Anna and picks Payment. Topic now holds payment, and the menu shows Payment. <pause> Figure twenty-one has the whole form. The heading Contact Us, the Name box with Anna in it, the Topic menu reading Payment, <breath> then an empty Message box with a counter that says zero of two hundred... and the Send button at the bottom.

<!-- block h3-027 | src: "mistake reading e target value on the tick" -->
<pause> Now, a slip that catches a lot of people. Reading e dot target dot value, on the tick box.

<!-- block p-105 code-024 | src: "next we add the tick box email me" -->
Next, we add the tick box, Email me a reply. <pause> Line seven of ContactForm dot jsx gives it a state, wants reply, with set wants reply... and it starts as false.

<!-- block p-106 code-025 | src: "the developer copies the handler from the text" -->
Now, the developer copies the handler from the text boxes. <breath> So the input with type equals checkbox gets checked equals wants reply, in curly braces, which is fine. But its on change calls set wants reply with e dot target dot value. <pause> That line is marked wrong. It reads a fixed string, not the tick. And under it come the words, Email me a reply.

<!-- block p-107 fig-022 | src: "the user ticks the box and it looks" -->
The user ticks the box, and it looks ticked. Then the user clicks again to untick it... and it stays ticked. <pause> In figure twenty-two, the form still shows Anna and Payment, but now there's a tick next to Email me a reply. <long-pause> And that tick is there even after the second click.

<!-- block p-108 | src: "the tick box has a value too so" -->
The tick box has a value too. <pause> So why is reading it wrong? Here is what happens.

<!-- block list-018 | src: "the user ticks the box and react calls" -->
The user ticks the box, and React calls on change. On a tick box, e dot target dot value is a fixed string that never changes with the tick. <breath> When the tick box has no value of its own, the browser makes this string on. So set wants reply saves the string on. <pause> React treats any text that is not empty as ticked, so the box is ticked. So far, so good. <breath> Then the user clicks again to untick. The browser removes the tick for a moment, and React calls on change again. But e dot target dot value is still on... so state is still on. <sigh> State did not change, so React puts the tick back, and the box stays ticked.

<!-- block p-109 code-026 | src: "the fix is to read the tick itself" -->
The fix is to read the tick itself. <pause> Same input, same checked equals wants reply. Only the on change is different. It now calls set wants reply with e dot target dot checked. <breath> That's true or false, right after the click.

<!-- block p-110 | src: "after a reload the box ticks and unticks" -->
After a reload, the box ticks and unticks with each click.

<!-- block h3-028 | src: "send puts the menu and the tick box" -->
<pause> And last in this section, Send puts the menu and the tick box back.

<!-- block p-111 code-027 | src: "the send handler now puts every part of" -->
The Send handler now puts every part of the form back to its start. <pause> Line fifteen opens handle send, which takes e, and line sixteen calls e dot prevent default. Line seventeen logs Sent, followed by name, topic, message, and wants reply. <breath> Then the resets. Line eighteen empties the name. Line nineteen sets topic back to delivery, the first option. Line twenty empties the message. And line twenty-one sets wants reply back to false... so the box is unticked again.

<!-- block p-112 | src: "no line of our code touches the menu" -->
Notice that no line of our code touches the menu or the tick box. <pause> So why does Send put Topic back to Delivery, and untick the box? The steps are the same as for the text box.

<!-- block list-019 | src: "the send handler saves delivery in topic and" -->
The Send handler saves delivery in topic, and false in wants reply. React renders ContactForm again. <pause> And React writes delivery into the menu... and false into the tick box.

<!-- block box-005 | src: "principle 4 menus and tick boxes the same" -->
<breath> Let's pull Principle four together. Menus and tick boxes, the same pair, with their own props. <pause> Control a menu with value on the select itself, never selected on an option. Control a tick box with checked, and read e dot target dot checked in its handler. <breath> A menu reports the value of the picked option, so value on the select must match one option. Writing selected on an option is the plain HTML habit, and React does not support it. <pause> A tick box holds true or false, so it takes checked from state. Its e dot target dot value is a fixed string such as on, which never changes with the tick. <breath> So, do this. Put value equals topic, in curly braces, on the select tag, with set topic reading e dot target dot value. The choice lives on the select. And give the tick box checked equals wants reply, with set wants reply reading e dot target dot checked. <pause> Don't do this. Don't write selected on the Payment option, because React does not support it. And don't let the tick box handler read e dot target dot value. It's always on... so the box never unticks.

<!-- part -->

<!-- block h2-006 | src: "section 5 principle 5 a controlled box starts" -->
<pause> And that brings us to Section five, and Principle five. <pause> A controlled box starts with an empty string.

<!-- block h3-029 | src: "the smallest version a city box that starts" -->
And one more tiny example to open with. <pause> A City box that starts with nothing.

<!-- block p-113 | src: "here is a city box whose state starts" -->
Here is a City box whose state starts with nothing at all. <breath> When the page opens, it looks like any empty box... and the Console is clean.

<!-- block fig-023 | src: "localhost 5173 city console no errors or warnings" -->
Figure twenty-three shows exactly that. The browser at localhost five one seven three, with one label, City, and an empty box beside it. <pause> Down below, the Console says: no errors or warnings. Nothing looks wrong yet.

<!-- block p-114 | src: "the only difference is the empty call to" -->
The only difference is the empty call to use state.

<!-- block code-028 | src: "src app jsx 1 import usestate from react" -->
So, in App dot jsx, line one imports use state from React, as usual. Line three starts our App component. <pause> Then line four is the one that matters. It makes city and set city with use state... and the parentheses are empty. No starting value at all, and the note there marks it as wrong. <breath> The rest is the controlled box we already know. A label that says City, and an input with value equals city, in curly braces, and an on change that takes e dot target dot value and hands it to set city.

<!-- block p-115 | src: "the user types a the letter appears but" -->
Now the user types the letter a. <pause> The letter appears... but a red message appears in the Console too.

<!-- block fig-024 | src: "localhost 5173 city a console a component is" -->
In figure twenty-four, the City box now holds the letter a. <long-pause> And under it, the Console shows a red error. In plain words, it says a component is changing an uncontrolled input to be controlled. <breath> It goes on: this is likely caused by the value changing from undefined to a defined value, which should not happen. Then it asks us to decide between a controlled or an uncontrolled input element for the lifetime of the component. <pause> And it ends with a link to more info, on react dot dev, about controlled components.

<!-- block h3-030 | src: "where did undefined come from" -->
<pause> So... where did undefined come from?

<!-- block p-116 | src: "our code never writes undefined javascript supplies it" -->
Our code never writes undefined. JavaScript supplies it. <pause> Here, use state receives no starting value, and in JavaScript, a missing argument is undefined. <breath> So React saves undefined as the first state of city.

<!-- block h3-031 | src: "why react warns when the box works" -->
<pause> Next, why React warns when the box works.

<!-- block p-117 | src: "the box works so what is react complaining" -->
The box works, right? <pause> So what is React complaining about? Here is what happens, in order.

<!-- block list-020 | src: "the page opens city is undefined so the" -->
The page opens. City is undefined, so the box gets no real value at all. <pause> React treats the box as uncontrolled, the same as a box with no value prop. <breath> Then the user types a. On change runs, and set city saves the string a. React renders again. And now the box has a real value, the string a. <pause> So the same box has switched, from uncontrolled to controlled. React cannot tell which one we meant... so it warns.

<!-- block p-118 | src: "react s documentation explains it the same way" -->
React's documentation explains it the same way. You cannot give a box an undefined value first, and a string later. <pause> In its words, "React won't know whether you want the component to be uncontrolled or controlled." <breath> A box must stay one kind for its whole life.

<!-- block p-119 | src: "think of a notebook that is suddenly declared" -->
Think of a notebook that is suddenly declared a whiteboard, in the middle of the lesson. <pause> The student was writing freely, and now the teacher wants to write on the same page. <chuckles> Nobody knows who owns the page any more.

<!-- block h3-032 | src: "starting with nothing and starting with an empty" -->
<pause> Now, one thing to keep straight. Starting with nothing, and starting with an empty string... are not the same.

<!-- block p-120 | src: "both versions draw the same empty box when" -->
Both versions draw the same empty box when the page opens. <pause> But they split at step one. <breath> When the state starts as an empty string, value is a real string from the very first render. So the box is controlled from the start... and it never switches.

<!-- block p-121 | src: "the opposite pair really is the same an" -->
The opposite pair really is the same. <pause> An undefined value, and no value prop at all, are the exact same thing for React. Both give an uncontrolled box.

<!-- part -->

<!-- block h3-033 | src: "mistake the email box that appears with nothing" -->
<pause> And one last mistake. The Email box that appears with nothing in it.

<!-- block p-122 | src: "back to our contact form when the user" -->
Back to our contact form. When the user ticks Email me a reply, an Email box should appear. <breath> The double ampersand from Lesson ten shows the box only when wants reply is true.

<!-- block code-029 | src: "src components contactform jsx 1 wantsreply 2 label" -->
This piece lives in ContactForm dot jsx. Line one opens curly braces with wants reply, the double ampersand, and a parenthesis. <pause> Inside, there's a label that says Email, and an input with value equals email, in curly braces. Its on change takes e dot target dot value and passes it to set email. <pause> Then the label closes, and the parenthesis and the curly brace close on line six.

<!-- block p-123 | src: "the email is not needed until the box" -->
The email is not needed until the box is ticked. <pause> So the developer gives its state no starting value.

<!-- block code-030 | src: "src components contactform jsx 8 const email setemail" -->
It's just one line, line eight of the same file. Email and set email, from use state, with empty parentheses. <pause> The note calls it wrong, because it's undefined until the first key.

<!-- block p-124 | src: "the user ticks email me a reply and" -->
The user ticks Email me a reply, and an empty Email box appears. <pause> The user types a... and the warning appears.

<!-- block fig-025 | src: "localhost 5173 contact us name anna topic payment" -->
Figure twenty-five has the whole contact form on screen. The heading Contact Us, the name Anna, the topic Payment, and a message counter at zero out of two hundred. <pause> Email me a reply is ticked, and the new Email box holds the letter a, right above the Send button. <long-pause> And in the Console, it's the same red message as before. A component is changing an uncontrolled input to be controlled, likely because the value changed from undefined to a defined value. <sigh> Same warning, same link to react dot dev.

<!-- block p-125 | src: "the steps are the same as for the" -->
The steps are the same as for the City box. <pause> And the fix is one empty string.

<!-- block code-031 | src: "src components contactform jsx 8 const email setemail" -->
Back on line eight, email and set email now come from use state with an empty string, two quotes with nothing between them. <pause> That's a real string from the first render.

<!-- block p-126 | src: "after a reload typing into the email box" -->
After a reload, typing into the Email box gives no warning.

<!-- block h3-034 | src: "send clears the whole form" -->
<pause> And finally, Send clears the whole form.

<!-- block p-127 | src: "now the send handler empties the email too" -->
Now the Send handler empties the email too. <pause> Every state goes back to its start... and no line of our code touches a box.

<!-- block code-032 | src: "src components contactform jsx 16 function handlesend e" -->
Down at line sixteen of ContactForm dot jsx, the function handle send receives the event, e. <pause> Line seventeen calls e dot prevent default, so the page does not reload. Line eighteen logs the word Sent, followed by name, topic, message, wants reply, and email. <breath> Then the clearing starts. Set name with an empty string. Set topic back to delivery. Set message with an empty string. Set wants reply to false. <pause> And on line twenty-three, set email with an empty string, never undefined, as the note says.

<!-- block p-128 | src: "notice that the email is cleared with an" -->
Notice that the email is cleared with an empty string. <pause> Clearing a box with undefined or null would make it switch the other way, from controlled to uncontrolled. <breath> So we clear with the same kind of value we started with.

<!-- block box-006 | src: "principle 5 starting value a controlled box starts" -->
So, Principle five, the starting value. A controlled box starts with an empty string. <pause> The state behind value must hold a string from the first render. So the state of an empty box starts as an empty string, never as nothing. <breath> A use state call with no starting value gives undefined. An undefined value is the same as no value at all, so the box starts uncontrolled. <pause> On the first key, state becomes a string, the box becomes controlled, and React warns... because a box cannot switch over its life. <breath> An empty string makes the box controlled from the first render. And clear it with an empty string too. <pause> So, do this: email and set email from use state with an empty string, controlled from the first render. <pause> And don't do this: email and set email from use state with nothing at all. That's undefined first, a string later... so React warns.

<!-- part -->

<!-- block h2-007 | src: "synthesis putting all five principles together" -->
<pause> Time for the synthesis. <pause> Putting all five principles together.

<!-- block h3-035 | src: "the complete contactform jsx file" -->
We begin with the complete file, ContactForm dot jsx.

<!-- block p-129 | src: "here is the finished form every box takes" -->
Here is the finished form. <breath> Every box takes what it shows from state, and every box reports its changes back to state.

<!-- block code-033 | src: "src components contactform jsx 1 import usestate from" -->
So this is source, components, ContactForm dot jsx, and it opens by importing use state from react. <pause> Then, inside the ContactForm function, lines four to eight hold five pieces of state, one for each part of the form. Name starts as an empty string. Topic starts as the string delivery. Message starts empty, wants reply starts as false, <breath> and email starts as an empty string too. The note there is principle five: it starts with a string, never undefined. <pause> Next come the two handlers. handle message change checks whether e dot target dot value dot length is two hundred or less, and only then calls set message with e dot target dot value. <breath> handle send takes the event, calls e dot prevent default, and logs Sent, followed by all five values. Then it puts every piece back: set name to an empty string, set topic to delivery, set message to empty, set wants reply to false, and set email to empty. <pause> Now the JSX. A section, a heading that says Contact Us, and a form whose on submit is handle send. <breath> The Name box gets value equals name in curly braces, and an on change that calls set name with e dot target dot value. That's principle three: value always comes with on change. <pause> The Topic menu works the same way, with value equals topic on the select itself, and three options inside it: delivery, payment, and other. Principle four, the choice lives on the select. <breath> The Message text area gets value equals message, and its on change is handle message change. Principle two, state goes into the box. Right under it, a paragraph shows message dot length, out of two hundred. <pause> Then the tick box. It's an input of type checkbox, with checked equals wants reply, and its on change calls set wants reply with e dot target dot checked. Principle four again: the tick, not the text. Its label says, Email me a reply. <breath> After that, wants reply, double ampersand, and a label with the Email box, so that box shows only when the tick is on. Its value is email, and its on change calls set email with e dot target dot value. Principle one, every key goes into state. <pause> And at the very bottom, a button of type submit that says Send.

<!-- block p-130 fig-026 | src: "the user fills in every part of the" -->
The user fills in every part of the form. <long-pause> And that's what figure twenty-six shows, just before Send. The Name box says Anna. The Topic menu is on Payment. <breath> The message reads, Where is my parcel? and the count under it says nineteen out of two hundred. <pause> The box Email me a reply is ticked, so the Email box is there, holding anna at example dot com. And below it all, the Send button.

<!-- block p-131 fig-027 | src: "then the user clicks send the console logs" -->
Then the user clicks Send. <pause> The Console logs every value, and the whole form is back to its start. <long-pause> Look at figure twenty-seven now. The Name box is empty, the Topic menu is back on Delivery, the message is empty, and the count says zero out of two hundred. <breath> The tick box is clear. And down in the Console there's one line: Sent, Anna, payment, Where is my parcel?, true, anna at example dot com... logged from line eighteen of ContactForm dot jsx.

<!-- block p-132 | src: "the email box is gone too send saved" -->
Notice the Email box is gone too. <pause> Send saved false in wants reply, so the double ampersand no longer shows it.

<!-- block h3-036 | src: "how react calls the components and what one" -->
<pause> Next, how React calls the components... and what one key does.

<!-- block p-133 | src: "when the page loads react starts at app" -->
When the page loads, React starts at App and follows the tags. <breath> App has only one tag, so React calls ContactForm next.

<!-- block fig-028 | src: "main jsx mounts app inside strictmode app 1" -->
Figure twenty-eight draws that as a small tree. <pause> At the top, main dot jsx mounts App inside strict mode. Below it, step one is App, the root component. It's called first, and it returns the ContactForm tag. <breath> Under that, step two, ContactForm. It's called second, and it holds five states, one for each part of the form. <pause> And it's called again after every key, every pick, every tick, and every Send.

<!-- block p-134 | src: "every controlled box goes around the same loop" -->
Every controlled box goes around the same loop, on every key.

<!-- block fig-029 | src: "one key in a controlled box 1 the" -->
Figure twenty-nine follows one key around that loop, in four steps. <pause> One, the browser shows the new letter in the box, just for a moment. <breath> Two, on change: React calls our handler with the event object. Three, the setter, here set message, saves the new text in state. <pause> And four, React renders again, and writes the state back into the box through value. <breath> So the letter stays.

<!-- part -->

<!-- block h3-037 | src: "summary" -->
<pause> Let's sum it all up.

<!-- block table-002 | src: "aspect the plain javascript habit the react rule" -->
The summary table puts each plain JavaScript habit next to the React rule, five rows in all. <breath> Reporting each key. The habit is to listen to the change event, which waits until the user leaves the box, or to save the text in a plain variable. <pause> The rule: use on change, which fires on every key, and save e dot target dot value with the setter. <breath> Emptying a box. The habit is to reach into the box and clear its text by hand. The rule: give the box value from state, then set the state to an empty string. <pause> A box with a value. The habit is to write the value and expect the user can still type. <breath> The rule: always pair value with on change, or use default value, or read only. <pause> Menus and tick boxes. The habit is to write selected on an option, and to read value from a tick box. The rule: put value on the select, and use checked with e dot target dot checked. <breath> And the starting value. The habit is to leave a variable empty until it's needed... and the rule is to start every controlled box with an empty string, never undefined.

<!-- block h2-008 | src: "interview prep for the interview" -->
<pause> Now, the interview prep. <pause> For the interview.

<!-- block question-002 | src: "the interview question how do you make an" -->
The question itself goes like this. <breath> How do you make an input, a text area, or a select fully controlled by React state?

<!-- block h3-038 | src: "how to answer clearly in 30 seconds" -->
How would you answer that clearly, in thirty seconds?

<!-- block p-135 | src: "a controlled field takes what it shows from" -->
A controlled field takes what it shows from state, and reports every change back to state. <pause> I give it two props: value from state, and on change, which saves e dot target dot value with the setter. <breath> React's on change fires on every key, like the browser's input event, not like the change event. After every render, React writes the state into the field, so state is the single source of truth. <pause> To empty the box after Send, I only set the state to an empty string. Four rules keep this working.

<!-- block list-021 | src: "value always comes with onchange without it react" -->
First, value always comes with on change. <pause> Without it, React puts the old text back after every key, and logs a read only field error. The handler saves exactly e dot target dot value, right away. <breath> Second, default value is not controlled. It only sets the starting text, and the box keeps its own text after that. <pause> Third, menus and tick boxes use the same pair. A select takes value on the select itself, never selected on an option. A checkbox takes checked, and reads e dot target dot checked. <breath> And fourth, start with an empty string. A controlled field must get a string from the first render. <pause> If it starts as undefined, React warns that an uncontrolled input is changing to controlled.

<!-- part -->

<!-- block h3-039 | src: "three classic follow up questions interviewers ask" -->
<pause> And finally, three classic follow up questions interviewers ask.

<!-- block list-022 | src: "what is the difference between a controlled and" -->
Here's the first. <pause> What is the difference between a controlled and an uncontrolled input, and when would you use each? <breath> Well, a controlled input gets value from state, or checked for a checkbox, and it reports with on change. React forces it to show what state holds. <pause> An uncontrolled input has no value. It may get a starting text from default value or default checked, and after that it keeps its own text inside the browser. <breath> A controlled field is worth it in two cases. The page needs the text on every key, such as for a live count. Or our code must change the field, such as emptying it after Send. <pause> A field can never be both, and it can't switch over its life. <breath> Choosing between controlled fields and reading an uncontrolled form with form data at submit time... that's the topic of Lesson forty.

<!-- block list-023 | src: "why does my input s caret jump or" -->
The second question. <pause> Why does my input's caret jump, or why does typing feel slow? <breath> A caret jumps when the handler doesn't save exactly e dot target dot value right away. Two common causes are saving a changed copy, such as with to upper case, and saving later, inside set timeout. <pause> Another cause is a field that React removes and adds again on every key. That happens when a component is defined inside another component, as in Lesson four, or when its key changes, which Lesson twenty-five covers. <breath> Slow typing has a different cause. Every key sets state, and every state change renders the component that holds it. If that component draws a large page, every key makes React render all of it again. <pause> The fix is to move the field and its state into a small component of its own, so each key renders only that small part. <breath> And use deferred value, from Lesson sixty-eight, is another tool for this.

<!-- block list-024 | src: "how do you control a select a checkbox" -->
And the third. <pause> How do you control a select, a checkbox, and a field whose value comes from an API? <breath> A select gets value on the select, and it must match the value of one option. Writing selected on an option is not supported in React. <pause> A select with multiple takes a list of values, instead of one string. <breath> A checkbox gets checked, which must always be true or false, and its handler reads e dot target dot checked... because e dot target dot value on a checkbox is a fixed string, such as on. <pause> A value from an API is often null or undefined until it arrives. So start the state with an empty string, or write value equals some value, double question mark, empty string, all in curly braces. <breath> The double question mark uses the empty string whenever the left side is null or undefined... <pause> so the field always gets a string. And that's where this lecture ends.
