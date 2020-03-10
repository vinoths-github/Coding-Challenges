package javaprog.io.navvis;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;

import javaprog.io.navvis.Node;

import java.util.PriorityQueue;
import java.util.Queue;

public class BinaryTree {
	
	public Node buildTree(HashMap<String, Integer> m)	{
		Node root = new Node(null, null), lnode = null, rnode = null;
		Integer temp = 0;
		PriorityQueue<Node> pq = mapToQueue(m); /*PriortyQueue to prioritize the least occurrence count*/
		
		if(pq.isEmpty()) { /*Basic Check*/
			return null;
		}
		while(!pq.isEmpty()) {
			lnode = pq.poll();
			if(pq.isEmpty())
				root = lnode;
			else {
				rnode = pq.poll();
				temp = lnode.count + rnode.count;
				root = new Node(null, temp, lnode, rnode);/*Parent node Creation*/
				pq.add(root);/*Parent node added again to the Queue*/
			}
		}
		return root;
	}
	
	public PriorityQueue<Node> mapToQueue(HashMap<String, Integer> m)	{
		if(m.size() == 0) {
			PriorityQueue<Node> pq = new PriorityQueue<>();
			return pq;/*Return an empty Queue*/
		}
		
		PriorityQueue<Node> pq = new PriorityQueue<>(m.size(),new NodeComparator());
		for(Map.Entry<String, Integer> entry : m.entrySet()) {
			Node leaf = new Node(entry.getKey(),entry.getValue());
			pq.add(leaf); /*Queue created with leaf nodes*/
		}
		return pq;
	}
	
	public void printBFS(Node root) {
		System.out.println("Printing the Tree by Level wise");
		Node p = root;
		Queue<Node> q = new LinkedList<Node>();
		
		if(p != null) {
			q.add(p);
			while(!q.isEmpty()) {
				p = q.poll();
				System.out.print(p.count);
				if(p.left != null)
					q.offer(p.left);
				if(p.right != null)
					q.offer(p.right);
			}
		}
	}
	public void printInorder(Node root) {
		Node p = root;
		if(p != null) {
			printInorder(p.left);
			System.out.println(p.count);
			printInorder(p.right);
		}
	}
	
	public void printLevelOrder(Node root) {
		if(root == null)
			return;
		Queue<Node> q =new LinkedList<Node>(); 
		q.add(root); 
		while(true) {
			int nodeCount = q.size(); 
			if(nodeCount == 0) 
		        break; 
		    while(nodeCount > 0) {
		        Node node = q.peek();
		        System.out.print(node.count);
		        if(node.left == null && node.right == null) {
		        	System.out.print("(" +node.key+ ")");
		        }
		        System.out.print(" ");
		        q.remove();
		        if(node.left != null)
		        	q.add(node.left);
		        if(node.right != null)
		        	q.add(node.right);
		        nodeCount--;
		    }
		    System.out.println();
		}
    }
}
