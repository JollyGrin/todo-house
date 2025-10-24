Goal: create a PWA web app, connected with a postgres db, to track daily household chores and shopping list. Tasks reward points. This will be a mono-repo

# Function

- List of daily household chores. Anyone can create a new one. Resets daily (or at specfied time). Some are required each day at certain times, and will indicate the user if they are approaching deadline/past. Some tasks have no deadlines/requirements and can be done as many times as desired (earning points)
- Shared shopping list: items can be added and checked off. Items added previously available as quick add
- Point tracking: show detailed stats of points earned over all time & per week.

# PWA requirements

- HIGH IMPORTANCE: real-time notifications (is it possible to change the notification icon? Default is the browser icon)
- install on device

# Backend Requirements

- Make a postgres db that can be deployed on railway

# Frontend Packages

- use nextjs
- will be deployed on railway.
- use axios to setup api requests
- use tanstack query to setup hooks (use infinite query wherever there is pagination)
- needs to be mobile first. Will mostly be used from mobile.
