package javaprog.io.navvis;

import java.util.Comparator;

public class NodeComparator implements Comparator<Node>{
	public int compare(Node n1, Node n2) {
		/*Comparison based on the occurrence count alone*/
		if (n1.count > n2.count)
			return 1; 
		else if (n1.count < n2.count)
			return -1; 
		return 0;
	}
}