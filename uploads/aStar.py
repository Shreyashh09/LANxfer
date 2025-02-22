import networkx as nx
import pandas as pd
import matplotlib.pyplot as plt


def read_graph(file):
    df = pd.read_csv(file)
    G = nx.DiGraph()
    for _, row in df.iterrows():
        G.add_edge(row["source"], row["target"], weight=row["weight"])
    return G


def read_heuristics(file):
    df = pd.read_csv(file)
    return {row["node"]: row["heuristic"] for _, row in df.iterrows()}


def a_star(graph, heuristics, start, goal):
    open_set = {start}
    came_from = {}
    g_score = {node: float("inf") for node in graph.nodes}
    g_score[start] = 0
    f_score = {node: float("inf") for node in graph.nodes}
    f_score[start] = heuristics[start]

    while open_set:
        current = min(open_set, key=lambda node: f_score[node])

        if current == goal:
            path = []
            while current in came_from:
                path.insert(0, current)
                current = came_from[current]
            path.insert(0, start)
            return path

        open_set.remove(current)

        for neighbor in graph.neighbors(current):
            tentative_g_score = g_score[current] + graph[current][neighbor]["weight"]
            if tentative_g_score < g_score[neighbor]:
                came_from[neighbor] = current
                g_score[neighbor] = tentative_g_score
                f_score[neighbor] = g_score[neighbor] + heuristics.get(
                    neighbor, float("inf")
                )
                open_set.add(neighbor)

    return None  # No path found


def visualize(graph, path):
    plt.figure(figsize=(12, 6))

    # Original Graph
    plt.subplot(1, 2, 1)
    pos = nx.spring_layout(graph)
    nx.draw(
        graph,
        pos,
        with_labels=True,
        node_color="lightblue",
        edge_color="gray",
        node_size=2000,
        font_size=10,
    )
    labels = nx.get_edge_attributes(graph, "weight")
    nx.draw_networkx_edge_labels(graph, pos, edge_labels=labels)
    plt.title("Original Graph")

    # Path Visualization
    plt.subplot(1, 2, 2)
    nx.draw(
        graph,
        pos,
        with_labels=True,
        node_color="lightgray",
        edge_color="gray",
        node_size=2000,
        font_size=10,
    )
    if path:
        path_edges = [(path[i], path[i + 1]) for i in range(len(path) - 1)]
        nx.draw_networkx_nodes(
            graph, pos, nodelist=path, node_color="orange", node_size=2000
        )
        nx.draw_networkx_edges(
            graph, pos, edgelist=path_edges, edge_color="red", width=2
        )
    plt.title("A* Search Path")

    plt.show()


def main():
    graph_file = "graph_weighted.csv"
    heuristics_file = "heuristics.csv"

    G = read_graph(graph_file)
    heuristics = read_heuristics(heuristics_file)

    source = input("Enter source node: ")
    destination = next(node for node, h in heuristics.items() if h == 0)

    path = a_star(G, heuristics, source, destination)
    print("Shortest path found:", path)
    visualize(G, path)


if __name__ == "__main__":
    main()
