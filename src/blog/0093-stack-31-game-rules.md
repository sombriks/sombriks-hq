---
layout: blog-layout.pug
tags:
  - posts
  - misc
date: 2026-07-24
draft: false
---
# STACK 31 - GAME RULEBOOK

**Stack 31** is a simple card game for one or more players.

## COMPONENTS

- 1 Standard 52-card deck (no jokers), split into 4 suits (Hearts, Diamonds,
  Clubs, and Spades).

## PREPARATION

- Shuffle the deck and place it face down in the center of the table.
- Players start with empty hands (0 cards).
- Set up 4 distinct pile zones on the table, one for each suit. All piles start 
  at an initial value of 0.

## THE GAME TURN

Players take turns in clockwise order. On their turn, a player MUST perform 
exactly ONE of the following actions:

### Draw

Take 1 card from the deck, respecting the maximum hand size limit of 6 cards.

### Play

Lay down a card from their hand onto the pile matching its suit.

### Discard

Choose a card from their hand and throw it into a neutral discard pile. This 
card loses its effect and leaves the game. The player can choose to discard it 
either face up (visible to everyone) or face down (kept secret).

Note: If a player fails to perform one of these three actions on their turn, 
they are disqualified from the match.

## CARD VALUES AND PILE RULES

- Number Cards (2 to 10): Add their face value to the pile of the corresponding 
suit.
- Ace: Counts as +1.
- King (K): Instantly maxes out the pile value to 31. It cannot be played if 
  the pile is already at 31.
- Jack (J): Subtracts -1 from the pile value. It can be played even if the pile 
  is already at 31.
- Queen (Q): Resets the total value of the pile to 0. It can be played even if 
  the pile is already at 31.

## MOVEMENT RESTRICTION (BUSTING)

- It is strictly illegal to play any card that causes a pile value to pass 31. 
- Moves that bust the pile cannot be made under any circumstances.

## GAME END AND CONQUERING PILES

- A pile is immediately conquered by the player who plays the card that brings 
  the total score to exactly 31. Once a player reaches 31, no other card 
  (except a Jack or Queen) can change ownership of that pile.
- New piles of the same suit are not created. Each suit yields only one pile 
  per match.
- If the draw deck runs out and no player has valid moves remaining on the 
  piles (or if everyone chooses to just discard/pass), the game ends.
- Piles that end below 31 are conquered by the player who made the last valid 
  play on it, as they came closest to the goal.

## WIN CONDITION

- Each player counts how many piles they conquered (maximum of 4).
- The player with the highest number of piles wins.
- In case players hold an equal number of conquered piles, the match ends in a 
  tie.
