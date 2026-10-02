Our ONLY source of truth for this idiosyncratic version is skills/v6.2 while launching new v3 for the application in new lectures. 

Problems we need to solve in the prelecture that designs the lecture: 

#   PROPER ORDER AUDIT
Order based on knogledge gaps, there is persistent problem of serious knowledge gaps, including glossary terms that were never explained before the glossary, even if mentioned. 

Each component (e.g in the wild topic, takeaway)  must make geuninely new contribution, not mere repetition. 

Example of Reconciliation: appears in glossary in lesson 1, not in the text, it is in the principle not explained previously
 

# CASE STUDY MEANINGFUL COMMENTARY 
The case studies in the end, must not be autistic in describing the code, it makes no sense. The explanation of the code needs to be meaninfully constructed to pedagogically explain the lessons from the code, not to map the code in words mechanically. There should be always messsages that the explanation need to explain in clear path.  


# THEORY-FIRST AND PRINCIPLE-BASED

Previous version had questions like "What is a React component?", the current v1 and v2 versions do not care. 

How to make sure each lecture has sufficient theory before the principles, with theory matched properly with sections (titles on the left side). We need complete theoretical introduction before the principles, so that there will be no serious gaps. 


# We need much more work and caution in naming and defining the principle. 

Of course we remove the vocabulary of "you must do this" and "must do that. 

We need to work on the principle themselves, they are still too often cryptic, not operationally clear. We need operational definition of the principle. 

principle 5.5

Instead of this: 

> [!PRINCIPLE]
> **Principle 5: Component Re-Renders Cascade Automatically to All Subtree Descendants**
> You must recognize that updating a parent component **re-evaluates all child descendants** on that branch (unless memoized), keeping state local to leaf nodes to prevent unnecessary cascading renders.
> 
> >> re-evaluates all child descendants : recursively calling render functions of every nested child in the subtree
> >> keep state local to leaf nodes : storing state as low in the tree hierarchy as possible
> 
> *It is best practice to do this:*
> `// Search state lives in SearchBox leaf`
> `function SearchBox() {`
> `  const [query, setQuery] = ...;`
> `}`
> 
> *Instead of doing this:*
> `// State hoisted to layout re-renders all`
> `function NewsLayout() {`
> `  const [query, setQuery] = ...;`
> `}`



this is much better alternavive:  

Principle 5: Subtree Isolation Prevents Sibling Collisions
This directly solves Marcus's editorial newsroom bug from the opening ladder. Why did the video player restart? Because Marcus inlined the ticker and video player into the same parent component rather than isolating them on separate tree branches.

[!PRINCIPLE] Principle 5: Subtrees Form Natural Isolation Boundaries That Protect Sibling Nodes. We organize independent features onto separate sibling branches, ensuring that activity in one part of the interface cannot disturb or reset parallel UI subtrees.

> >> subtree boundary : a self-contained branch in the component tree that encapsulates local behavior sibling protection : guaranteeing that peer components never re-evaluate when an adjacent branch changes

It is best practice to do this: <NewsLayout> <HeaderBar />   {/* Branch 1 */} <VideoPlayer /> {/* Branch 2 */} </NewsLayout>

Instead of doing this: // Monolithic entanglement function Page() { // Ticker and Video tangled in one node return <div><Ticker /><Video /></div>; }

# Number of principles must be adaptable 
all chapters have 5 principles, an irrational numerical fixation, all principles followed by 2 bulllets etc. 

the number of principles must be flexible and pertinent to the topic at hand
the bullet points of explanations, also not fixed but pertinent to the question and depth at hand

All principles now are followed by two explanations, unacceptable fixation.


