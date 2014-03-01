LXC - DNS
=========

Answering to your DNS LXC requests since 2014 =)

Download and configure
----------------------

> Requires node and npm. For ubuntu: ```sudo apt-get install nodejs npm```

```
@> sudo npm install -g lxc-dns
@> lxc-dns
```

From git:

```
@> git clone https://github.com/eazel7/lxc-dns.git lxc-dns
@> (cd lxc-dns && npm install)
```

Run
---


```
sudo node lxc-dns/index.js
```

Test
----

This application is currently equivalent to listing the containers with ```lxc-ls --fancy``` and parsing the output to get a container IPv4 address.

My containers:

```
@> lxc-ls --fancy

NAME   STATE    IPV4        IPV6  AUTOSTART
-------------------------------------------
cont1  RUNNING  10.0.3.169  -     NO
cont2  RUNNING  10.0.3.98   -     NO
cont3  RUNNING  10.0.3.10   -     NO
```

So, if the DNS runs ok, 

```
@> nslookup cont1 - 127.0.0.1

Server:		127.0.0.1
Address:	127.0.0.1#53

Non-authoritative answer:
Name:	cont1
Address: 10.0.3.169
```

Turning off a container should turn make it stop answering quite soon:

```
@> lxc-stop -n cont2
@> nslookup cont2 - 127.0.0.1
Server:		127.0.1.1
Address:	127.0.1.1#53

Non-authoritative answer:
*** Can't find cont2: No answer
```

### DNS suffix

If you want to answer also to a certain DNS suffix, add an ```ACCEPT_SUFFIX``` environment variable. 

```
@> sudo ACCEPT_SUFFIX=".lab1" node lxc-dns/index.js
```

Test with:

```
@> nslookup cont1.lab1 - 127.0.0.1

Server:		127.0.0.1
Address:	127.0.0.1#53

Non-authoritative answer:
Name:	cont1.lab1
Address: 10.0.3.169
```


