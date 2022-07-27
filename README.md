

# Simplem
Minimal notepad-like markdown editor. To write down your amazing ideas immediately.

[Demo](https://isahamawan.github.io/Simplem)  
(The function of linking with Google Drive can only be used by test users. Please contact us if you are interested.)

[日本語表示](https://github.com/isahamawan/Simplem/blob/master/README_JA.md)

![logo](https://github.com/isahamawan/Simplem/blob/master/misc/readme_src/capture/simplem_logo.png)

![view](https://github.com/isahamawan/Simplem/blob/master/misc/readme_src/capture/simplem.png)



## What is important when you come up with an idea?
I came up with a good idea.

Unfortunately, while looking for a piece of paper and a pen to write down my ideas, I forgot my important idea.

When you come up with an idea, it's important to write it down quickly with a piece of paper and a pen.


<div align = "center">
<img src = "https://github.com/isahamawan/Simplem/blob/master/misc/readme_src/idea.png" width = "50%" alt = "idea">
</div>

**”Simplem is a paper and pen-like app that you can launch as soon as you come up with an idea and write it down without hesitation, regardless of style.”**

### how?
- It will start up as soon as you start it, and you do not need to set the style or page.
- Narrowed down the number of fonts. Enjoy choosing from unique fonts
- Aiming for a simple writing taste like the default notepad
- You can also display the modified diff!


## What is important when formulating an idea?
I wanted to come up with an idea for my work, and I was thinking while writing a sentence that it wasn't like that using common word software.

However, as time went by, I became worried about the size of the headings and how the letters were aligned, and I became conscious of trying to make them beautiful.

When that happened, it was too late, and I didn't want to break the clean headlines and the alignment of the characters, so I couldn't modify the text freely.


<div align = "center">
<img src = "https://github.com/isahamawan/Simplem/blob/master/misc/readme_src/fast.png" width = "50%" alt = "worry">
</div>


If this happens, even if I am conscious of "let's write freely because it's okay to break the beauty", my heart that wants to maintain the beauty gets in the way and I can't write as I want.

**”Simplem is an app like “Notepad in your head” that allows you to concentrate on devising ideas without thinking about “beauty”. ”**

<div align = "center">
<img src = "https://github.com/isahamawan/Simplem/blob/master/misc/readme_src/meditation.png" width = "50%" alt = "consentration">
</div>

### how?
- Because you can use markdown notation, you can not spend time sticking to the "cleanliness" of sentences
- Headings and bold letters are displayed reasonably well, which helps you organize your ideas, even though you don't have to spend much time maintaining "cleanliness".
- The markdown mark is not displayed except when editing (live preview), so it does not interfere with reading the text.
- Unlike other live preview markdown editors, the font size of the edit screen is unified, so you can write sentences freely and without hesitation.
- If you think it's a lie, think you've been fooled and compare your tomorrow's schedule with Simplem and other Markdown editors.
- The table of contents and links are automatically created based on the headings, so you can easily go back and forth in the document.
- In addition, we are adding daily ideas to realize "Notepad in the head" on the computer.

## It's hard to rewrite the ideas you've put together!
It took me two hours to write down the ideas I put together in Notepad with Word software to show them to others.

It took another two hours to make a slide from a clean copy for presentation to more people.

Do you have experience too? Common in my environment 😂

**”Simplem is an application that allows you to create clear copies and slides from one idea memo.”**


<div align = "center">
<img src = "https://github.com/isahamawan/Simplem/blob/master/misc/readme_src/all.png" width = "50%" alt = "all-purpose">
</div>

### how?
- Markdown notation makes it nice and tidy
	- When printing or outputting PDF, the heading is displayed larger according to the heading rank.
- At the time of output, heading 1 (h1) automatically breaks the page (can be turned on and off with the ⇦ option)
- At the time of output, page break with horizontal line (hr) (can be turned on and off with ⇦ option)
- You can edit it as a slide by pressing the "Slides" button.
	- Page break with horizontal line (hr). You can also do a slide show!
- You can write down your own findings and ideas on the edit screen with html comment notation.
	- For example, you can leave the following comment in the sentence. It disappears at the time of output
		- `<! --A great idea to write in a sentence later! -> `

# Functions list

- diff display
![diff](https://github.com/isahamawan/Simplem/blob/master/misc/readme_src/capture/diff.png)
- Automatic table of contents generation (heading-based)
![toc](https://github.com/isahamawan/Simplem/blob/master/misc/readme_src/capture/toc.png)
- Slide editing / display (marp)
![slides](https://github.com/isahamawan/Simplem/blob/master/misc/readme_src/capture/slides.png)
- <! Comment function that is not printed with ---> (ideas, memos and fair copy can coexist and be managed collectively) 
- Semi-transparent display
- Always on top
- Code highlight function
- Toolbar
- Output function (pdf, html)
- html tag is valid
- Source code mode
- Font switching (unique font available)
- Page break with h1 when printing
- Page breaks at the time of printing ---
- Mermaid js (If there is a need for slide display)
- Dark mode
- Shortcut key
- Voice input (mac only)
- Read aloud <!-(Mac only)->


# What Simplem is aiming for
- Lightweight and comfortable markdown editor to replace the default notepad
- Small is beautiful
- Paper and pen-like apps
- A simple flat text editor. The management of images, tables, and files is left to the software that is good at it.
- Good "writing taste"
- You can easily write what you have come up with like a notepad, and you can output the written material as a document, slide, or book in a beautiful format without any hassle.
- Simple design, easy for anyone to modify or modify
- Do not pollute the development environment (no installation required, make the software as portable as possible)
	- It's hard to reinstall every time you use a new PC. In addition, newer PCs may not have administrator privileges.
- No automatic update.
	- To avoid annoying update prompts for users and unexpected function additions during use.
	- When users want to try new features, have them download the new version on their own initiative.
	- If you make the app a portable design, you can just delete the old version together with the folder.

# License
MIT