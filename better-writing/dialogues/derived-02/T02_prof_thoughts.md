# T02 — Professor THOUGHTS (drafting the reply to the doubler)

## What this turn has to do

Three moves, in order. First, concede the student's doubler actually runs and prints the right number. Do this before any reframe, because if I dodge the output I lose trust. Second, reframe: the fight was never about whether the doubler produces the right number, it was about whether producing the right number means the two tools are the same tool. Third, introduce the one distinction that cracks it: a watch is push, a derived is pull. Define both words humanely. Then stop, and leave the contradiction in "pull" visible, because the student taking pull literally and breaking it is the entry to T03.

## Draft

Run the doubler in our vocabulary. Show output. Then: you bolted two jobs together, a watcher to do the math and a spare signal to hold the answer. The derived is the single tool that fuses them. Introduce push and pull. One paragraph, one slide. The slide carries the doubler code and output, because the proof is the pedagogy.

## Term-definition audit

- **side effect**: when code reaches outside itself and touches the world. Printing to the console, changing the DOM, firing a network request. The textbook example is `console.log`. For this student, the React mapping is "the thing `useEffect` is for." Humane version: a side effect is anything the function does besides returning a value. If the function's job is to leave a mark on the world, that mark is the side effect.
- **push** (in reactivity): when a value changes, it immediately notifies everything that depends on it. The change pushes outward, right now. Humane version: push is a shout. The value yells "I changed" the instant it changes, and everyone who subscribed has to hear it whether they want to or not.
- **pull**: when a value changes, nothing happens yet. The change is only remembered. The work happens later, when somebody asks for the result. Humane version: pull is a note left on the desk. The value does not shout. It just leaves a sticky note saying "I changed," and whoever needs the answer has to come read it and do the math themselves, on their own schedule.
- **dependency**: a value that another piece of code reads, and therefore depends on. Already lightly used in T01. Worth one humane line here because I lean on it in both push and pull definitions: a dependency is just an input. If your function reads `count`, then `count` is a dependency of your function, the same way `count` is an input to the formula `count * 2`.

No other new terms. I am deliberately not introducing "dirty," "cached," "recompute," or "subscribe" yet. Those come in T03, each with their own definition at the moment they become load-bearing.

## The contradiction I am planting

End the turn by naming it myself, so the student does not feel gaslit when they hit it. "If pull means do nothing when the input changes, then a purely lazy box never knows its input changed. Sit with that." I want them to take pull literally and break it. That break is T03's entire reason to exist.

## Length check

One paragraph of prose (concede, reframe, push vs pull, plant the contradiction). One slide (the doubler code and its tested output). The push/pull distinction lives in the prose, not a second slide. Good.
