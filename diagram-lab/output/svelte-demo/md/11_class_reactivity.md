## 11 — Class Reactivity
@tags State Management, OOP

**Q. How do you bundle reactive data together with the methods that modify it into a single, portable object?**

**Answer.** If you are building a complex game character, having their health `$state` and their `takeDamage()` logic scattered across multiple files is an organizational nightmare. You declare class fields using the `$state` rune inside a standard JavaScript class, letting you bundle live data and complex logic into clean, reusable objects.

```svelte title="User.js"
export class User {
  name = $state('');
  
  constructor(name) {
    this.name = name;
  }
}
```

```svelte title="Profile.svelte"
<script>
  import { User } from './User.js';
  const user = new User('Alice');
</script>

<input bind:value={user.name} />
```

<div class="dg" style="background:#e0f2fe; padding:40px 20px; border:4px solid #000; position:relative; overflow:hidden;">
  <!-- Decor -->
  <div style="position:absolute; top:-40px; left:-10px; font-size:140px; opacity:0.1; font-weight:900; line-height:1; font-family:monospace;">{ }</div>
  
  <div style="display:flex; flex-direction:column; align-items:center; position:relative; z-index:2;">
    <!-- The Blueprint -->
    <div style="border:4px solid #000; background:#3b82f6; color:#fff; padding:12px 24px; font-family:monospace; font-weight:bold; font-size:16pt; box-shadow:6px 6px 0 0 #000; margin-bottom:30px; transform:rotate(-2deg);">
      class User
    </div>
    
    <div style="display:flex; justify-content:center; gap:24px; width:100%;">
      <!-- Instances -->
      <div style="border:3px solid #000; background:#fff; padding:16px 12px; display:flex; flex-direction:column; align-items:center; box-shadow:4px 4px 0 0 #000; width:120px;">
        <span style="background:#000; color:#fff; font-size:7pt; padding:2px 6px; margin-bottom:8px; font-weight:bold; letter-spacing:0.1em;">INSTANCE</span>
        <span style="font-size:24pt; margin-bottom:4px;">👤</span>
        <span style="font-family:monospace; font-weight:bold; font-size:10pt;">user1</span>
        <span style="background:#fef08a; padding:2px 6px; font-size:7pt; border:2px solid #000; margin-top:8px; font-weight:bold;">$state</span>
      </div>
      
      <div style="border:3px solid #000; background:#fff; padding:16px 12px; display:flex; flex-direction:column; align-items:center; box-shadow:4px 4px 0 0 #000; width:120px;">
        <span style="background:#000; color:#fff; font-size:7pt; padding:2px 6px; margin-bottom:8px; font-weight:bold; letter-spacing:0.1em;">INSTANCE</span>
        <span style="font-size:24pt; margin-bottom:4px;">👤</span>
        <span style="font-family:monospace; font-weight:bold; font-size:10pt;">user2</span>
        <span style="background:#fef08a; padding:2px 6px; font-size:7pt; border:2px solid #000; margin-top:8px; font-weight:bold;">$state</span>
      </div>
    </div>
  </div>
</div>

> **Summary.** `$state` now works perfectly inside a JavaScript `class`. This is powerful because it lets you bundle your reactive data together with the custom logic that updates it. You can now create clean, reusable objects to pass around your app.
