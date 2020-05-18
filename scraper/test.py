# -*- coding: utf-8 -*-
import sys
import re
from selenium import webdriver
from selenium.webdriver.support.ui import Select


driver = webdriver.Chrome('./chromedriver')
driver.get('https://news.naver.com/main/read.nhn?mode=LSD&mid=shm&sid1=101&oid=081&aid=0003091276')
title = driver.find_element_by_xpath('//*[@id="articleTitle"]')

print(title.text)