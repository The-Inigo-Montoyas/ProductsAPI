psql;

CREATE DATABASE sdc;

\c sdc;

CREATE TABLE product (
  id SERIAL,
  name VARCHAR(100),
  slogan VARCHAR(1000),
  description VARCHAR(1000),
  category VARCHAR(60),
  default_price INT NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE features (
  id SERIAL,
  product_id INT NOT NULL,
  feature VARCHAR(100),
  value VARCHAR(100),
  PRIMARY KEY (id),
  CONSTRAINT fk_product
    FOREIGN KEY(product_id)
      REFERENCES product(id)
);


CREATE TABLE styles (
  id SERIAL,
  product_id INT NOT NULL,
  name VARCHAR(100),
  sale_price VARCHAR(100),
  original_price BIGINT,
  default_style SMALLINT,
  PRIMARY KEY(id),
  CONSTRAINT fk_product
    FOREIGN KEY(product_id)
      REFERENCES product(id)
);

CREATE TABLE skus (
  id SERIAL,
  style_id INT NOT NULL,
  size VARCHAR(60),
  quantity INT,
  PRIMARY KEY(id),
  CONSTRAINT fk_styles
    FOREIGN KEY(style_id)
      REFERENCES styles(id)
);

CREATE TABLE related (
  id SERIAL,
  current_product_id INT NOT NULL,
  related_product_id INT NOT NULL,
  PRIMARY KEY(id),
  CONSTRAINT fk_product
    FOREIGN KEY(current_product_id)
      REFERENCES product(id)
);

CREATE TABLE photos (
  id SERIAL,
  style_id INT NOT NULL,
  url VARCHAR(255),
  thumbnail_url VARCHAR(255),
  PRIMARY KEY(id),
  CONSTRAINT fk_styles
    FOREIGN KEY(style_id)
      REFERENCES styles(id)
);

