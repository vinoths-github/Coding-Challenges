package javaprog.io.navvis;

public class Node {
	Node left;
	Node right;
	String key;
	Integer count;
	public Node(String key, Integer count, Node left, Node right) {
		super();
		this.key = key;
		this.count = count;
		this.left = left;
		this.right = right;
	}
	public Node(String key, Integer count) {
		super();
		this.key = key;
		this.count = count;
		this.left = null;
		this.right = null;
	}
}
