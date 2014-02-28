LXC - DNS
=========

Answering to your DNS LXC requests since 2014 =)

It's the equivalent to listing the containers with ```lxc-ls --fancy``` and parsing its output to get a container IPv4 address.

```
@> lxc-ls --fancy

NAME   STATE    IPV4        IPV6  AUTOSTART
-------------------------------------------
cont1  RUNNING  10.0.3.169  -     NO
cont2  RUNNING  10.0.3.98   -     NO
cont3  RUNNING  10.0.3.10   -     NO
```

Usage
-----

```
git clone https://github.com/eazel7/lxc-dns.git lxc-dns
(cd lxc-dns && npm install)
```

Run with:

```
sudo node lxc-dns/index.js
```

Test with:
```
@> nslookup cont1 - 127.0.0.1

Server:		127.0.0.1
Address:	127.0.0.1#53

Non-authoritative answer:
Name:	cont1
Address: 10.0.3.169
```### DNS suffix

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


