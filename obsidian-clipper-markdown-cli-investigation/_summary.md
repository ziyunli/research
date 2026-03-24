This investigation analyzed how the Obsidian Clipper browser extension converts web pages to Markdown. The main logic centers on the Defuddle library, which extracts readable content and metadata from the DOM, then converts the cleaned HTML into Markdown. By inspecting the Clipper code and implementing a CLI prototype, the research confirmed that Obsidian's extraction pipeline can be effectively replicated outside the browser, with minimal code, using Defuddle and JSDOM for DOM emulation and markdown generation. Following review, the CLI was enhanced with stricter output validation and improved error handling for user-friendliness.

**Key findings:**
- Obsidian Clipper's Markdown conversion relies almost entirely on [Defuddle](https://github.com/mgmarlow/defuddle), which performs content extraction and markdown transformation.
- The pipeline can be reproduced in Node environments using Defuddle and JSDOM, yielding both markdown and metadata.
- The CLI prototype demonstrates straightforward extraction; enhancements addressed CLI argument validation and error handling.

**Links:**  
- [Obsidian Clipper source](https://github.com/obsidianmd/obsidian-clipper)  
- [Defuddle library](https://github.com/mgmarlow/defuddle)
