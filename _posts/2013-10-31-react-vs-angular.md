---
layout: post
title: "React vs Angular"
subtitle:
description: "A post on Reddit by /u/floydophone"
link:
date: 2013-10-31
tags: [Angular,React,javascript]
category:
image:
  feature: code-blur.jpg
  thumb: code-blur-thumb.jpg
  credit: "By /u/floydophone"
  creditlink: http://www.reddit.com/r/javascript/comments/1oo1y8
share: true
---
*This is a post by [/u/floydophone](http://www.reddit.com/user/floydophone) on [Reddit](http://reddit.com) on [this](http://www.reddit.com/r/javascript/comments/1oo1y8) thread.*

First of all I think it's important to evaluate technologies on objective rather than subjective features. "It feels nicer" or "it's cleaner" aren't valid reasons: performance, modularity, community size and ease of testing / integration with other tools are.

I've done a lot of work benchmarking, building apps, and reading the code of Angular to try to come up with a reasonable comparison between their ways of doing things.

<!--more-->

Community / project maturity
---------------------------------

I think Angular's big advantage on React is that its open-source community is larger since it's been open-sourced since 2009 I believe and we only open-sourced in May 2013. So there's certainly a bigger ecosystem of Angular code and docs than React at this time. We try to compensate for this by being super responsive on IRC/Twitter/Google Groups, but it's still an advantage for Angular for sure.

Please don't confuse that with project maturity though. We've had React in production at Facebook since 2011. And while that's two years younger than Angular, we actually use it on all of our major JS initiatives for Facebook and Instagram. Even though Google maintains the project, they aren't betting much of their core products on Angular at this time.

So while our open-source tooling may be a bit immature, I'd wager that the React core is probably the most battle-tested of any modern JS library except for jQuery and Google Closure (which is what they use on Plus and other properties).

Performance
--------------

There's two ways to look at performance: how performant is your code written the naive way, and how hard is it to optimize within the constraints of the framework?

With smaller apps Angular and React don't have a noticeable difference in performance. When you scale up, both can get a little slow, but their performance is still comparable (I think React is a bit faster usually since we dirty check only what's rendered vs all the data in Angular, but that's certainly debatable and not really that much of an advantage anyway).

React really shines in terms of performance when you want to optimize. React optimizations are just one-liner methods added to a single component to provide "hints" to React to help it short-circuit change detection. We should really write a blog about this, but usually you can add one simple line of code and get crazy (20x) speedups.

With Angular you have to basically turn off data binding for parts of your application since it relies on dirty checking via `$watch()`. This is slow because you have to keep two copies of the data model around (expensive) and do an O(n) check on each change. At this point you lose many of the benefits of Angular.

The thing is, Angular's philosophy about performance is that [50ms is imperceptible to humans and is an adequate level of performance](http://stackoverflow.com/questions/9682092/databinding-in-angularjs). I think this is crazy: when motion is involved humans can perceive hiccups as small as 16ms (which is why browsers run at 60fps. Movies run at 30fps because the camera captures motion blur). So if you want to use declarative data binding for direct manipulation via touch, you're gonna want to be able to do it in under 16ms. That's the level of performance we aim for (and get) with React. You have to work around Angular to get that level of performance.

Also, `Object.observe()` will help in the future, but it's unclear whether it will ever be as fast as our technique which doesn't require any browser support. I've read the implementation of `Object.observe()` in the v8 source code and it has similar downsides to using getters and setters for everything (I've heard it may change in the future, though).

Finally, I don't think Angular directives have a great notion of lifecycle. With React (and Ext, and some others) we batch reads on the DOM and writes to the DOM. I don't think Angular has a way of enforcing this with directives since you're free to do any sort of DOM manipulation within them. This can be a *huge* source of performance problems if you aren't disciplined everywhere (which is hard to scale in a big eng org)

Mechanisms for code reuse
------------------------------

If you look at Angular examples you'll see fewer lines of code than for React. That's because Angular's built-in directives are optimized for simple tasks, which make for great demos but break down when you try to build anything big. When you try to build something big, you'll be writing new directives.

The problem is that Angular directives were designed to bridge JavaScript and the DOM. Specifically, you write them in JavaScript and invoke them from the DOM. This has a few implications. First, since you're not invoking from JavaScript, Angular has rebuilt some programming language features without going all the way and admitting that it's a new programming environment. This is why isolate scopes are hard to use.

Second, directives are hard to compose. You need to basically invoke them from a string in your template (or parse it into a string from the DOM). This makes them impossible to statically analyze and easy for people to screw up and introduce XSS holes since you're passing a string into Angular. This is clear from the fact that the default recursion limit in Angular is 10.

Since composing directives is so annoying, they end up being basically mini-jQuery apps that are pretty hard to maintain. Since they're hard to maintain people don't use them enough, so you end up with monolithic directives or fat controllers. When you get these big modules, changes in one part of the codebase require changes in other parts of the codebase, which reduces maintainability.

Said another way, coupling goes up, cohesion goes down.

React is all about data flow between loosely-coupled, cohesive components. See my deck here: http://slideshare.net/floydophone/react-preso-v2

Server rendering
-------------------

React was built from the beginning to support server rendering (i.e. the React core does not use a *single* browser API). Rendering in PhantomJS isn't really an option for us since booting up a whole DOM to handle a page request is simply too expensive to do at scale. Sure -- it works for mostly static pages or low-traffic sites, but if you want to get the awesome performance benefits it won't scale. I'm not even sure if Angular supports reusing server-rendered markup like we do (the only framework I know of that does this correctly is AirBnb's Rendr).

Tooling integration
---------------------

Both projects have some issues here -- we encourage the use of JSX syntax which may cause users some friction, and Angular came up with its own module system rather than use the battle-tested CommonJS standard as well as having problems with minification and DI.

Angular's community size compensates for all of the stuff that they've invented. The fact that you can precompile your JSX to regular JS and that React reuses community standards and tools for everything means I think that we're pretty even on this front too.

Simplicity
-----------

Angular is built on the idea of adding HTML attributes to make it powerful enough to build applications. This is not a solid theoretical foundation and results in lots of neologisms -- scopes, transclusion, directives, reliance on dependency injection (in JS? really?), its own module system, its own idea of model/view/controller, etc etc.

There is so much to learn, and it's because the foundation of Angular is fundamentally flawed. It's sad too: if you read the source of Angular it's written very well. The team behind it is obviously very good. It just feels like they have to keep hacking around the fact that the core ideas are pretty bad.

With React, the only thing you need to learn about to build scalable apps are components.

My conclusion
----------------

If you're building a simple example or prototype, use Angular. Its built-in directives will get you farther in a shorter amount of time than React.

But simple apps are simple until they aren't anymore. At the point you start needing to write a lot of custom directives, you'll really start to fall out of love with Angular like I did. And this point always happens earlier than you think you will (ever want to insert an extra row with ng-repeat?)

React scales down and up and we use it at scale on all sorts of stuff (newsfeed, page insights, mobile site navigation, basically all new JS development since mid 2012). And we're around to support you when you try it out. I think you should give it a shot :)