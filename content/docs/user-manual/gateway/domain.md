---
title: 通过域名访问提供HTTP服务的组件
description: 介绍 Rainbond 如何通过配置域名的方式访问提供HTTP类协议服务的组件
weight: 10
aliases:
  - /docs/user-manual/gateway/traffic-control/
---

> 本文适用于应用开发者和运维人员

部署到 Rainbond 的提供 HTTP 协议服务的组件如何被访问是本文描述的重点。Rainbond 的网关服务设计成可直接面向公网环境，因此使用 Rainbond 网关可以直接管理企业所有业务的公网流量流向。在对外提供服务的场景中，访问 HTTP 服务最常见的方式是使用域名。企业通常对外只有一个外网 IP 地址，端口资源特别 80/443 端口资源非常有限，使用域名的方式可以很好的复用端口。

接下来我们开始操作绑定一个域名到 Rainbond 网关并访问到已部署的组件。

### 前提条件

1. 已成功部署可访问的提供 HTTP 服务的组件，比如基于源代码部署任意一个 Demo。
2. 准备一个可以使用的域名并做好 DNS 解析（测试情况下可以做本地解析，正式使用请配置好正确的 DNS 解析）

### 操作流程

1. <b>确认前提条件已经准备就绪</b> 假设准备的域名为 www.example.com
2. <b>配置网关策略</b> 为了便于用户配置网关策略，管理和新增策略的的入口有三个，分别是：团队视图/网关/访问策略管理页面；应用视图/网关策略管理页面；组件管理面板，端口管理下；不同的管理页面主要是管理的策略范围不同，添加的方式一致。添加策略主要分为两部分配置：`路由规则`和`访问目标`。我们在路由规则中填写 `www.example.com` 这个域名，在访问目标中选择已经部署的 Demo 组件确认保存即可。

3. <b>验证策略是否生效</b> 直接点击已经添加的策略发起访问，正常打开组件页面即已配置成功。

### 了解原理和更多配置参数

Rainbond 网关实现可以认为是一个 ingress-controller，基于 openresty `1.15.8.2`版本实现。用户配置的策略会被翻译成 Kubernetes Ingress 资源，然后自动在 Rainbond 网关中生效。如何生成的 Kubernetes Ingress 资源是 Rainbond 内部实现对于用户透明，因此这里暂不做详细解读，这里主要讲解配置策略时除了域名以为其中支持的参数。

#### 路由参数

- <b>域名</b>: 最主要的路由参数，上文例子中我们只设置了这一个参数，同一个域名可以重复设置，路由访问不同的组件目标，服务于灰度发布场景。
- <b>请求路径</b>: 在域名相同的情况下，可以根据不同的请求路径来区分请求不同的组件服务。
- <b>请求头</b>: 使用请求头来区分不同的请求路由主要应用于灰度发布场景中。
- <b>HTTPs 证书</b>: 选择配置了 HTTPs 证书即将当前策略升级为 HTTPS，同时支持配置 HTTP 转移策略，包括 HTTPS/HTTP 共存和 HTTP 强转 HTTPS。HTTPs 证书需要在证书管理中提前上传添加。 Rainbond Cloud 版本中目前支持自动签发证书，即根据配置的域名自动匹配已有证书，若不存在则调用第三方平台自动完成签发，随后完成证书绑定。
- <b>权重</b>: 当多条策略的上述路由参数全部一致时，权重即可生效。设置不同的权重访问到不同的组件（一般情况下是同一个业务的不同版本同时部署多个组件），适用于灰度发布场景。

#### 代理参数设置

> 代理参数需要在策略添加后在管理列表中点击参数设置进行更改，支持动态生效。

- <b>连接超时时间</b>
  定义与上游服务器(upstream)建立连接的超时时间. 单位是秒, 默认: 75.

- <b>请求超时时间</b>
  设置将请求传输到上游服务器(upstream)的超时时间. 单位是秒, 默认: 60. 仅在两次连续写入操作之间设置超时时间, 而不是为整个请求的传输. 如果上游服务器服务器在此时间内未收到任何内容，则关闭连接.

- <b>响应超时时间</b>
  定义从上游服务器(upstream)读取响应的超时时间. 单位是秒, 默认: 60. 仅在两个连续的读操作之间设置超时, 而不是为整个响应的传输. 如果上游服务器在此时间内未传输任何内容, 则关闭连接.

- <b>上传限制</b>
  设置上传内容(或请求正文)的最大限制, 将大小设置为 0 将不作限制. 单位是 Mb, 默认: 1.

- <b>自定义请求头</b>
  设置了自定义请求头后, 每个发往上游服务器(upstream)的请求都会带上这些请求头.

- <b>后端响应缓冲区</b>
  对应 Nginx 的 proxy_buffering 参数, 默认关闭. 如果关闭了后端响应缓冲区，那么 Nginx 会立即把从后端收到的响应内容传送给客户端;. 如果开启了后端响应缓冲区, 那么 Nignx 会把后端返回的内容先放到缓冲区当中，然后再返回给客户端; 并且这个过程是边收边传，不是全部接收完再传给客户端.

- <b>Websoket</b>
  在网关支持的 WebSocket 与单纯的 WebSocket 不同, 是在 HTTP 的基础上, 使用 HTTP Upgrade 机制将连接从 HTTP 升级到 WebSocket. 这个 HTTP Upgrade 机制是在请求中添加两个自定义请求头, 分别是 ‘Upgrade \$http_upgrade’ 和 ‘Connection “Upgrade”’, 当勾选了 Websoket, 网关会自动为当前的策加上这两个请求头。

#### 默认域名机制

HTTP 协议的组件在打开端口的对外访问权限时，若没有配置任何访问时自动为其分配一个默认域名。默认域名的生成策略如下：

```
{port}.{service-alias}.{team-alias}.{default_domain_suffix}
# eg. http://5000.gr6f1ac7.64q1jlfb.17f4cc.grapps.cn
```

其中 default_domain_suffix 在每一个集群安装过程中用户可以指定或 Rainbond 自动分配。

### 参考视频

{{<bibili-video src="//player.bilibili.com/player.html?aid=200637879&bvid=BV1Wz411q7Rm&cid=190491579&page=1" href="https://www.bilibili.com/video/BV1Wz411q7Rm/" title="使用域名访问组件操作参考视频">}}

### 常见问题

- 配置了域名后怎么不能访问

  > 不能访问可能有一以下几个原因：DNS 解析错误；组件未处于正常运行状态；组件端口配置与实际监听端口不一致；组件不是提供的 HTTP 服务。可跟随上述优先级依次排查故障。

- 默认分配域名可否修改

  > 默认分配的域名首先可以进行删除动作移除，其次默认域名分配的后缀可以通过修改集群属性进行修改，分配的策略目前暂不支持修改。

- 是否支持泛域名策略

  > 支持，域名配置可直接使用泛域名，比如`*.example.com`,那么不管访问 `a.example.com`还是`b.example.com`都可以路由到指定的组件。