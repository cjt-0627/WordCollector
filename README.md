

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

* [![Vue][Vue.js]][Vue-url]
* [![Bootstrap][Bootstrap.com]][Bootstrap-url]

### Limits

This project is exclusively for Mandarin speakers learning English.


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

### Sign with Google account before you use

Go to **Settings** and sign with Google account. After signing, you have to click the blank space to close the popup. Then, click the extension again. If you login success, your browser will pop up an alert to tell you.

### 1. Collect Words on the Go

When reading an article or browsing a website, simply highlight an unfamiliar English word, click the extension icon (or use the right-click menu), and add it to your collection.

### 2. Choose Your Translation Mode

WordCollector supports three different translation engines to suit your learning style. Go to the settings panel to switch between:
* **(🔥Recommendation) Cambridge Translation**: Detailed dictionary definitions ad examples. If you change to this mode and click the button, you will be


* **Google Translation**: Fast and straightforward.

* **AI Translation**: Get context-aware translations. (Requires your own API key).



### 3. Build & Review Your Vocabulary Volumes

You can organize your saved words into custom volumes. Open the extension's dashboard to review your collections whenever you want.


### Setting up AI Translation 

To use the AI translation feature, you need to provide your own API key:

1. Obtain an API key from your preferred AI provider and API url which suits OpenAI form.
2. Open WordCollector and navigate to **Settings**.
3. Paste your API key and API url into the designated field and click the confirm button, and then choose the model you want. Your key is stored locally and securely on your browser.


<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

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

[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/

[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
