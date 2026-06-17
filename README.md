<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

`<a id="readme-top"></a>`

<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->

<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[Contributors][contributors-url]
[Forks][forks-url]
[Stargazers][stars-url]
[Issues][issues-url]
[Unlicense License][license-url]
[LinkedIn][linkedin-url]

<!-- PROJECT LOGO -->

<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="src/assets/greenBook3.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Word Collector</h3>

<p align="center">
    Collect words you're unfamiliar with, use it to review them!
</div>

<!-- TABLE OF CONTENTS -->

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

WordCollector is an open-source Chrome extension designed to help English learners effortlessly collect and review vocabulary while browsing the web. Built with user-friendliness and intuitive navigation in mind, the app allows users to build custom vocabulary lists tailored to their learning pace.

### Key Features:

* **Flexible Vocabulary Management:** Build and organize your personal word bank seamlessly.
* **Multiple Translation Modes:** Switch between Google Translate, AI-powered translation (via your personal API), and Cambridge Dictionary definitions.
* **Web-Centric Learning:** Perfect for reading articles, watching videos, or studying online resources.

The project is currently under active development, with new features being introduced regularly. As an open-source tool, WordCollector is completely free to use, and contributions from the community are highly welcome. If you are on your journey to mastering English, this app is built for you!

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

This section should list any major frameworks/libraries used to bootstrap your project. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.

* [Vue][Vue-url]
* [Bootstrap][Bootstrap-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

Before getting started with word_collector, please install Chrome or Brave browser.

### Installation

Since this project is entirely open-source and free, it is currently not published on the Chrome Web, but you can easily install it manually in just a few steps!

#### Step 1: Download the Extension

1. Go to the https://github.com/cjt-0627/WordCollector/releases/tag/v1.0.0 page of this repository.
2. Download the latest `.zip` file
3. Extract (unzip) the downloaded file into a folder on your computer.

#### Step 2: Load into Chrome

1. Open Google Chrome and type `chrome://extensions` in the address bar, then press Enter.
2. Toggule on **Developer mode** in the top-right corner.
3. Click the **Load unpacked** button in the top-left corner.
4. Select the folder you just extracted.
5. **Done!** Click the puzzle icon in the top-right corner of your browser and pin **WordCollector** to your toolbar for easy access.

---

### For Developers (Build from source)

If you prefer to build the project yourself:

1. Clone the repository: `git clone https://github.com/cjt-0627/wordcollector`
2. Navigate to the folder: `cd wordcollector`
3. Install dependecies: `npm install` (or `yarn`)
4. Build the app: `npm run build` (or `yarn build`)
5. Follow **Step 2** above, but select the newly generated `dist` folder to load the extension.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

WordCollector is designed to seamlessly integrate into your daily web browsing. Here is how you can start building your vocabulary:

### 1. Collect Words on the Go

When reading an article or browsing a website, simply highlight an unfamiliar English word, click the extension icon (or use the right-click menu), and add it to your collection.

### 2. Choose Your Translation Mode (切換翻譯模式)

WordCollector supports three different translation engines to suit your learning style. Go to the settings panel to switch between:

* **(🔥Recommendation) Cambridge Translation**: Detailed dictionary definitions and examples.
* **Google Translation**: Fast and straightforward.
* **AI Translation**: Get context-aware translations. (Requires your own API key).

> 🖼️ *(Insert a screenshot of the settings/translation mode selection panel)*
> `![Translation Modes](link-to-your-image-or-gif)`

### 3. Build & Review Your Vocabulary Volumes (建立與複習單字本)

You can organize your saved words into custom volumes. Open the extension's dashboard to review your collections whenever you want.

> 🖼️ *(Insert a screenshot of the review dashboard or vocabulary list)*
> `![Review Dashboard](link-to-your-image-or-gif)`

### ⚙️ Setting up AI Translation (設定 AI 翻譯 API)

To use the AI translation feature, you need to provide your own API key:

1. Obtain an API key from your preferred AI provider.
2. Open WordCollector and navigate to **Settings**.
3. Paste your API key into the designated field and save. Your key is stored locally and securely on your browser.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [X] Add Changelog
- [X] Add back to top links
- [ ] Add Additional Templates w/ Examples
- [ ] Add "components" document to easily copy & paste sections of the readme
- [ ] Multi-language Support
  - [ ] Chinese
  - [ ] Spanish

See the [open issues](https://github.com/othneildrew/Best-README-Template/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Top contributors:

<a href="https://github.com/othneildrew/Best-README-Template/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=othneildrew/Best-README-Template" alt="contrib.rocks image" />
</a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the Unlicense License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Your Name - [@your_twitter](https://twitter.com/your_username) - email@example.com

Project Link: [https://github.com/your_username/repo_name](https://github.com/your_username/repo_name)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

Use this space to list resources you find helpful and would like to give credit to. I've included a few of my favorites to kick things off!

* [Choose an Open Source License](https://choosealicense.com)
* [GitHub Emoji Cheat Sheet](https://www.webpagefx.com/tools/emoji-cheat-sheet)
* [Malven&#39;s Flexbox Cheatsheet](https://flexbox.malven.co/)
* [Malven&#39;s Grid Cheatsheet](https://grid.malven.co/)
* [Img Shields](https://shields.io)
* [GitHub Pages](https://pages.github.com)
* [Font Awesome](https://fontawesome.com)
* [React Icons](https://react-icons.github.io/react-icons/search)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->

<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com
