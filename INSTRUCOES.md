
---

### `INSTRUCOES.md`

# Instruções do Desafio – Highload Delivery Simulation

> Este documento detalha as informações de arquitetura e teste do sistema de delivery escalável, com seus endpoints e fluxos de trabalho.

---

### Índice
1. [Objetivo do desafio](#1-objetivo-do-desafio)
2. [Requisitos técnicos](#2-requisitos-técnicos)
3. [Modelos de dados](#3-modelos-de-dados)
4. [Endpoints](#4-endpoints)
    - 4.1 [Criar Pedido](#41-criar-pedido)
    - 4.2 [Consultar Status](#42-consultar-status-do-pedido)
    - 4.3 [Atualização de Status](#43-atualização-de-status-pelo-worker)
    - 4.4 [Notificações](#44-conexão-de-notificações)
5. [Teste de carga](#5-teste-de-carga)

---

## 1. Objetivo do Desafio

- Criar um sistema que **receba milhares de pedidos simultâneos**.
- Direcione cada pedido para o restaurante correto.
- Atualize e cacheie o status do pedido em tempo real.
- Notifique clientes e restaurantes via **WebSocket ou SSE**.

---

## 2. Requisitos Técnicos

- **Node.js (Express)** – API backend.
- **MongoDB** – Armazena pedidos e restaurantes.
- **RabbitMQ / Redis** – Filas e cache.
- **WebSockets / SSE** – Notificações em tempo real.
- **Docker** – Contêineres para serviços.

---

## 3. Modelos de Dados

## Restaurante

| Campo      | Tipo    | Descrição                       |
|-----------|--------|---------------------------------|
| `_id`      | `string` | Identificador único do restaurante |
| `name`    | `string` | Nome do restaurante             |
| `address` | `string` | Endereço completo do restaurante |
| `products`| `array`  | Lista de produtos disponíveis   |

### Exemplo de Restaurante
```json
{
  "_id": "resto123",
  "name": "Pizza da Esquina",
  "address": "Rua das Pizzas, 101",
  "products": [
    { "productId": "pizza-1", "name": "Pizza Mussarela", "price": 50 },
    { "productId": "drink-7", "name": "Refrigerante", "price": 8 }
  ]
}
```

---

## Pedido

| Campo         | Tipo     | Descrição                        |
|--------------|---------|----------------------------------|
| `_id`         | `string` | Identificador único do pedido    |
| `customerId`  | `string` | ID do cliente que fez o pedido   |
| `restaurantId`| `string` | ID do restaurante               |
| `items`       | `array`  | Lista de produtos e quantidades |
| `status`      | `string` | Status atual do pedido           |
| `createdAt`   | `string` | Timestamp de criação             |
| `updatedAt`   | `string` | Timestamp da última atualização  |

### Exemplo de Pedido
```json
{
  "_id": "order123",
  "customerId": "cust001",
  "restaurantId": "resto123",
  "items": [
    { "productId": "pizza-1", "quantity": 2 }
  ],
  "status": "RECEIVED",
  "createdAt": "2025-09-04T10:30:00Z",
  "updatedAt": "2025-09-04T10:32:00Z"
}
```

---

## 4. Endpoints

---

### 4.1. Criar Pedido

- **Endpoint:** `POST /orders`  
- **Descrição:** Cria um novo pedido.

#### Parâmetros de Requisição (Body)
| Campo         | Tipo     | Descrição                        |
|--------------|---------|----------------------------------|
| `customerId`  | string  | ID do cliente                    |
| `restaurantId`| string  | ID do restaurante                |
| `items`       | array   | Lista de produtos e quantidades  |
| - `productId` | string  | ID do produto                    |
| - `quantity`  | number  | Quantidade do produto            |
| `address`     | string  | Endereço de entrega              |

#### Body de Exemplo
```json
{
  "customerId": "cust001",
  "restaurantId": "resto123",
  "items": [
    { "productId": "pizza-1", "quantity": 2 },
    { "productId": "drink-7", "quantity": 1 }
  ],
  "address": "Rua XPTO, 1000"
}
```

#### Fluxo de Processamento
1. Valida se os itens pertencem ao restaurante.  
2. Cria o pedido no MongoDB (status = RECEIVED).  
3. Publica o pedido na fila do restaurante.  
4. Dispara notificação em tempo real para o restaurante.  

---

### 4.2. Consultar Status do Pedido

- **Endpoint:** `GET /orders/:id`  
- **Descrição:** Consulta o status de um pedido.

#### Fluxo de Consulta
1. Busca status no cache Redis.  
2. Fallback para MongoDB se não encontrado.  
3. Retorna status atual do pedido.  

---

### 4.3. Atualização de Status pelo Worker

- **Descrição:** Um worker processa as atualizações de status dos pedidos.

#### Status do Pedido
| Status             | Descrição                       |
|------------------|---------------------------------|
| PREPARING         | Pedido está sendo preparado.     |
| OUT_FOR_DELIVERY  | Pedido saiu para entrega.        |
| DELIVERED         | Pedido foi entregue ao cliente.  |

#### Fluxo do Worker
1. Consome a fila do restaurante.  
2. Atualiza status do pedido.  
3. Persiste no MongoDB e atualiza Redis.  
4. Dispara notificação em tempo real.  

---

### 4.4. Conexão de Notificações

- **Endpoint:** `/notifications/stream?userId=xxx`  
- **Descrição:** Conexão para receber atualizações em tempo real via SSE (Server-Sent Events) ou WebSocket.

#### Exemplo de Evento SSE
```json
{
  "type": "ORDER_STATUS_UPDATE",
  "orderId": "order123",
  "status": "OUT_FOR_DELIVERY",
  "timestamp": "2025-09-02T15:22:00Z"
}
```

---

## 5. Teste de Carga
  - **Pedidos simultâneos:** Simular milhares de pedidos em diferentes restaurantes.
  - **Consultas de status:** Simular consultas frequentes do status do pedido.
  - **Notificações:** Simular múltiplas conexões simultâneas para notificações em tempo real (SSE/WebSocket).