---
permalink: /
title: ""
excerpt: ""
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

{% if site.google_scholar_stats_use_cdn %}
{% assign gsDataBaseUrl = "https://cdn.jsdelivr.net/gh/" | append: site.repository | append: "@" %}
{% else %}
{% assign gsDataBaseUrl = "https://raw.githubusercontent.com/" | append: site.repository | append: "/" %}
{% endif %}
{% assign url = gsDataBaseUrl | append: "google-scholar-stats/gs_data_shieldsio.json" %}

<span class='anchor' id='about-me'></span>

{% include_relative includes/intro.md %}

{% include_relative includes/news.md %}

{% include_relative includes/pub.md %}

{% include_relative includes/experience.md %}

{% include_relative includes/honers.md %}

{% include_relative includes/edu.md %}

<!-- # 💬 Invited Talks
-----
- *2021.06*, Visual intelligence for enhanced perception, Huawei internal talk
- *2021.06*, Digital Image Processing, Beihang international class
- *2020.06*, Deep learning interpretability, Meituan internal talk

# 💻 Internships
-----
- *2022.03 - 2022.10*, [IDEA](https://www.idea.edu.cn), Vistring Lab, Shenzhen, China.
- *2016.07 - 2017.05*, [DJI](https://www.dji.com/cn), Visual Perception Group, Shenzhen, China. -->

<!-- <center> <i><font color=Gray>Last updated on Aug. 2023</font></i> </center> -->