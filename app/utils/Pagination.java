package utils;

public class Pagination {

	private int currentPage=1;
	private int totalPage;
	private int totalRecord;
	private int displayCountOfPerPage = 10;
	private int startRow=1;
	private int maxRow=10;
	
	private static Pagination page=new Pagination();
	private Pagination(){}
	public static Pagination getInstance(){
		return page;
	}

	public int getCurrentPage() {
		return currentPage;
	}

	public void setCurrentPage(int currentPage) {
		if(currentPage>getTotalPage()){
			this.currentPage = getTotalPage();
		}else if(currentPage<=0){
			this.currentPage=1;
		}
		else {
			this.currentPage = currentPage;
		}
		this.currentPage=this.currentPage<=0?1:this.currentPage;
		setStartRow((this.currentPage-1)*displayCountOfPerPage);
		setMaxRow(getStartRow()+displayCountOfPerPage);
	}

	public int getTotalPage() {
		return totalPage;
	}

	public void setTotalPage(int totalPage) {
		this.totalPage = totalPage;
	}

	public int getTotalRecord() {
		return totalRecord;
	}

	public void setTotalRecord(int totalRecord) {
		int tp = totalRecord % displayCountOfPerPage > 0 ? totalRecord
				/ displayCountOfPerPage + 1 : totalRecord
				/ displayCountOfPerPage == 0 ? 1 : totalRecord
				/ displayCountOfPerPage;
		setTotalPage(tp);
		this.totalRecord = totalRecord;
	}

	public int getDisplayCountOfPerPage() {
		return displayCountOfPerPage;
	}

	public void setDisplayCountOfPerPage(int displayCountOfPerPage) {
		this.displayCountOfPerPage = displayCountOfPerPage;
	}
	public int getStartRow() {
		return startRow;
	}
	public void setStartRow(int startRow) {
		this.startRow = startRow;
	}
	public int getMaxRow() {
		return maxRow;
	}
	public void setMaxRow(int maxRow) {
		this.maxRow = maxRow;
	}

}
