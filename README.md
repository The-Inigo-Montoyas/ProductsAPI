# ProductsAPI

The Products API was one of the services of a complete backend system, that was designed to support the demands of production level traffic on an e-commerce platform. Although the entire backend system was redesigned in a collaboration with other engineers, I took full control of the Products API. I opted to work with a RDBMS as we were dealing with highly structured data and had to access many different tabular relationships. PostgreSQL was the database of choice. After data clean-up and code migration, the endpoints were optimally queried and locally tested using k6 to handle upto 1000VUs, and it performed pretty satisfactorily with a latency of 13ms for 1000VUs. 
Following this, I deployed my server and database useing AWS EC2 instances, after containerizing my service using Docker to ensure ease of deployment and swift scalability. Ater stress-testing using a cloud-based tool, Loader.io, I horizontally scaled my service by adding more instance and using Nginx as a load-balancer to reroute traffic equally between all servers. After adding about 7 instances, I realized that horizontal scaling was no longer benefiting performance optimization, which is when I decided to configure Nginx settings, specifically the worker connections and keep-alive requests. This helped me meet my goals and reduced the error rate to being almost negligible. 
After horizontal scaling and Nginx config customizations, I was able to achieve a throughput of 60K clients per minute, with a latency of less than 2000ms and less than 1% error rate.


# Technologies Utilized

<ul>
  <li>PostgreSQL </li>
  <li>AWS </li>
  <li>Docker </li>
  <li>Nginx </li>
  <li>Loader.io</li>
  <li>k6 </li>
</ul>


# Results


