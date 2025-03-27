class Node {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.isStart = false;
        this.isFinish = false;
        this.isWall = false;
        this.distance = Infinity;
        this.isVisited = false;
        this.previousNode = null;
    }
}

class PathfindingVisualizer {
    constructor() {
        this.rows = 20;
        this.cols = 50;
        this.grid = [];
        this.startNode = null;
        this.finishNode = null;
        this.isMousePressed = false;
        
        this.initializeGrid();
        this.setupEventListeners();
    }

    initializeGrid() {
        const gridContainer = document.getElementById('grid-container');
        gridContainer.style.gridTemplateColumns = `repeat(${this.cols}, 25px)`;

        // Initialize grid with nodes
        for (let row = 0; row < this.rows; row++) {
            const currentRow = [];
            for (let col = 0; col < this.cols; col++) {
                const node = new Node(row, col);
                currentRow.push(node);
                
                const nodeElement = document.createElement('div');
                nodeElement.className = 'node';
                nodeElement.id = `node-${row}-${col}`;
                
                // Set start and finish nodes
                if (row === 10 && col === 10) {
                    node.isStart = true;
                    nodeElement.classList.add('start');
                    this.startNode = node;
                }
                if (row === 10 && col === 40) {
                    node.isFinish = true;
                    nodeElement.classList.add('finish');
                    this.finishNode = node;
                }
                
                gridContainer.appendChild(nodeElement);
            }
            this.grid.push(currentRow);
        }
    }

    setupEventListeners() {
        document.getElementById('visualize-btn').addEventListener('click', () => {
            this.visualizeDijkstra();
        });

        // Add wall drawing functionality
        document.querySelectorAll('.node').forEach(node => {
            node.addEventListener('mousedown', (e) => {
                this.isMousePressed = true;
                this.handleNodeClick(e.target);
            });
            node.addEventListener('mouseenter', (e) => {
                if (this.isMousePressed) {
                    this.handleNodeClick(e.target);
                }
            });
        });

        document.addEventListener('mouseup', () => {
            this.isMousePressed = false;
        });
    }

    handleNodeClick(nodeElement) {
        const [row, col] = nodeElement.id.split('-').slice(1).map(Number);
        const node = this.grid[row][col];
        
        if (!node.isStart && !node.isFinish) {
            node.isWall = !node.isWall;
            nodeElement.classList.toggle('wall');
        }
    }

    visualizeDijkstra() {
        const visitedNodesInOrder = this.dijkstra();
        this.animateAlgorithm(visitedNodesInOrder);
    }

    dijkstra() {
        const visitedNodesInOrder = [];
        this.startNode.distance = 0;
        const unvisitedNodes = this.getAllNodes();
        
        while (unvisitedNodes.length) {
            this.sortNodesByDistance(unvisitedNodes);
            const closestNode = unvisitedNodes.shift();
            
            if (closestNode.isWall) continue;
            if (closestNode.distance === Infinity) return visitedNodesInOrder;
            
            closestNode.isVisited = true;
            visitedNodesInOrder.push(closestNode);
            
            if (closestNode === this.finishNode) return visitedNodesInOrder;
            
            this.updateUnvisitedNeighbors(closestNode);
        }
        return visitedNodesInOrder;
    }

    sortNodesByDistance(unvisitedNodes) {
        unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
    }

    updateUnvisitedNeighbors(node) {
        const neighbors = this.getUnvisitedNeighbors(node);
        for (const neighbor of neighbors) {
            neighbor.distance = node.distance + 1;
            neighbor.previousNode = node;
        }
    }

    getUnvisitedNeighbors(node) {
        const neighbors = [];
        const { row, col } = node;
        
        if (row > 0) neighbors.push(this.grid[row - 1][col]);
        if (row < this.rows - 1) neighbors.push(this.grid[row + 1][col]);
        if (col > 0) neighbors.push(this.grid[row][col - 1]);
        if (col < this.cols - 1) neighbors.push(this.grid[row][col + 1]);
        
        return neighbors.filter(neighbor => !neighbor.isVisited);
    }

    getAllNodes() {
        const nodes = [];
        for (const row of this.grid) {
            for (const node of row) {
                nodes.push(node);
            }
        }
        return nodes;
    }

    animateAlgorithm(visitedNodesInOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(this.getNodesInShortestPathOrder());
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).classList.add('visited');
            }, 10 * i);
        }
    }

    getNodesInShortestPathOrder() {
        const nodesInShortestPathOrder = [];
        let currentNode = this.finishNode;
        while (currentNode !== null) {
            nodesInShortestPathOrder.unshift(currentNode);
            currentNode = currentNode.previousNode;
        }
        return nodesInShortestPathOrder;
    }

    animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).classList.add('shortest-path');
            }, 50 * i);
        }
    }
}

// Initialize the visualizer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PathfindingVisualizer();
});