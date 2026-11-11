A lift: the floor indicator and the call button! You want to change the floor you do not change what is written in the floor indicator, you press the controller that has the floor buttons.




=====

The lift covers almost every rule in Lesson 16, and one of the fits is surprisingly exact. Here is the mapping.

| Lesson 16 idea | In the lift |
| :--- | :--- |
| **Batching** | While the doors are open, passengers press their buttons. The lift does not leave after the first press; it departs once the doors close. In React, the doors close when the event handler finishes its last line. |
| **Snapshot** | While you stand there pressing buttons, the floor indicator still says `0`. Pressing does not change the indicator, and `setScore` does not change `score` inside the running handler. |
| **Separate clicks** | Each trip is its own trip. The people who get in at the next stop press their buttons on the next journey. Two clicks are never merged into one. |
| **Plain value vs. updater** | This is the exact fit. A plain value such as `setScore(1)` is the floor button marked **1**: press it three times and the lift still goes to floor 1. An updater such as `s => s + 1` is an imaginary button marked **one floor up**: press it three times and the lift rises three floors. |
| **The `addPoint` bug** | The helper glances at the indicator, reads `0`, and presses **1**. It does this three times, still reading `0` each time. The lift goes to floor 1, not floor 3. |
| **Pending state** | The floor the lift will have reached after the presses before yours. A **one floor up** press counts from there, not from the indicator. |
| **Mixing the two** | Press **one floor up**, then press **2**. The fixed button wins and the lift goes to floor 2, because an absolute floor ignores everything before it. Reverse the order and you get floor 3. |
| **Purity and StrictMode** | In testing, the engineer runs the route calculation twice to check that it gives the same answer. If your **one floor up** button also rang a bell, the bell would ring twice. So the button only works out the floor, and the bell is rung by the passenger, in the handler. |

**Two honest limits:**

1. **Real lifts have no "one floor up" button.** I would present it openly as an imaginary button. It is still easy to picture, and the contrast between "go to floor 1" and "go up one" is exactly what the lesson needs.
2. **Real lifts serve floors in the order of travel**, not in the order buttons were pressed. The text should simply not claim otherwise. It only needs press order for the mixing rule, where one fixed floor cancels what came before.

**One thing to decide:** the intro already uses the waiter's notepad for the same ideas. Two images for one lesson compete for the reader's attention. With the lift already opening the lesson, it would be cleaner to let the lift carry the whole intro.

**What I need from you is one choice:**

1. Replace the waiter with the lift throughout the 16-04 intro, including the diagram.
2. Keep the waiter, and use the lift only for state and its setter.

