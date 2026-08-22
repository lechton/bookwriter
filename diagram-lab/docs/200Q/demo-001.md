Subject: Lifecycle & Effects
Title: Preventing Infinite Loops
Interview Question: Q:How do you prevent an infinite loop when using the `$effect` rune?

CODE: ```<script>
  import { untrack } from 'svelte';
  let count = $state(0);
  let logs = $state([]);

  $effect(() => {
    // We read 'count', so this effect tracks it.
    let current = count;
    
    // We MUST untrack writing to 'logs'
    // or the effect will loop endlessly!
    untrack(() => logs.push(`Count: ${current}`));
  });
</script>
```

Summary: If an $effect modifies a piece of state that it also depends on (or accidentally reads while writing), it will trigger itself continuously. Wrap the risky read/write block in untrack() to tell Svelte: 'Do this, but don't subscribe to its changes.'


Design description: The graphic is contained within a wide, thick black rectangular border enclosing a light gray background patterned with faint, diagonal pinkish-beige pinstripes. Within this space, there are two distinct rectangular cards placed side-by-side. The left card features a white background with a solid gray drop shadow offset to the bottom right. At the top center of this card, slightly overlapping its upper edge, is a smaller red rectangular badge with a thick black border containing the white sans-serif text "DANGER: LOOP". Inside the left card, the text "logs.push()" is centered in a light red, monospaced font, positioned directly above a matching light red icon of two circular arrows indicating a continuous loop. In contrast, the right card has a pale green background, a thick black border, and a solid black drop shadow offset to the bottom right. Straddling its top edge is a bright green badge with a thick black border that reads "SAFE: UNTRACK()" in black sans-serif text. Centered inside this right card is the text "untrack(...)" in a dark green monospaced font, which sits above a prominent, bold black "X", followed immediately underneath by the smaller, bold gray sans-serif text "LINK BROKEN".